import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { prisma } from "./prisma";

import { fileURLToPath } from "node:url";
import { OAuth2Client } from "google-auth-library";
import { requireAuth, AuthRequest } from "./middleware/requireAuth";


const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

// Middlewares
app.use(cors({ origin: true }));
app.use(express.json());


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sert backend/src/public/videos via /videos
app.use(
  "/videos",
  express.static(path.join(__dirname, "public/videos"))
);


// Load OpenAPI YAML
const openapiPath = path.join(process.cwd(), "src", "openapi.yaml");
const openapiRaw = fs.readFileSync(openapiPath, "utf8");
const openapiDoc = YAML.parse(openapiRaw);

// Routes
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// MOCK DATA
const course = {
  id: "course-1",
  title: "Bases de la LSF",
  lessonIds: ["lesson-1"],
};

const lesson = {
  id: "lesson-1",
  title: "Dire bonjour",
  steps: [
    {
      type: "video",
      videoUrl: "/videos/bonjour.mp4",
    },
    {
      type: "qcm",
      question: "Que signifie ce signe ?",
      choices: ["Bonjour", "Merci", "Au revoir"],
      correctIndex: 0,
    },
  ],
};

const dictionary = [
  {
    id: "sign-1",
    word: "Bonjour",
    videoUrl: "/videos/bonjour.mp4",
  },
];

// ROUTES
app.get("/api/courses", (_req, res) => {
  res.json([course]);
});

app.get("/api/courses/:courseId", (_req, res) => {
  res.json(course);
});

app.get("/api/lessons/:lessonId", async (req, res) => {
  const { lessonId } = req.params;

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) return res.status(404).json({ error: "Lesson not found" });

  // format attendu par ton frontend (steps video + qcm)
  return res.json({
    id: lesson.id,
    title: lesson.title,
    steps: [
      { type: "video", videoUrl: lesson.videoUrl },
      {
        type: "qcm",
        question: lesson.question,
        choices: lesson.choices,
        correctIndex: lesson.correctIndex,
      },
    ],
  });
});


app.get("/api/dictionary", (_req, res) => {
  res.json(dictionary);
});

app.post("/api/auth/google", async (req, res) => {
  const { idToken } = req.body as { idToken?: string };
  if (!idToken) return res.status(400).json({ error: "idToken missing" });

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload?.sub) return res.status(401).json({ error: "Invalid token" });

  const userId = payload.sub;

  await prisma.userProgress.upsert({
    where: { userId },
    update: {},
    create: { userId, xp: 0, completedLessons: [] },
  });

  // Simple: on renvoie le même idToken pour l’utiliser comme accessToken
  return res.json({ accessToken: idToken });
});

app.get("/api/progress/me", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const p = await prisma.userProgress.upsert({
    where: { userId },
    update: {},
    create: { userId, xp: 0, completedLessons: [] },
  });

  res.json(p);
});

app.get("/api/progress/me/lesson/:lessonId/attempt", requireAuth, async (req: AuthRequest, res) => {
    const userId = req.userId!;
  const { lessonId } = req.params;

  const attempt = await prisma.lessonAttempt.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });

  if (!attempt) return res.status(404).json({ error: "No attempt" });
  res.json(attempt);
});

app.post("/api/attempts", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const { lessonId, selectedIndex } = req.body as { lessonId?: string; selectedIndex?: number };

  if (!lessonId || typeof selectedIndex !== "number") {
    return res.status(400).json({ error: "lessonId, selectedIndex required" });
  }

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) return res.status(404).json({ error: "Lesson not found" });

  const isCorrect = selectedIndex === lesson.correctIndex;
  const xpAwarded = isCorrect ? 10 : 0;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const attempt = await tx.lessonAttempt.create({
        data: { userId, lessonId, selectedIndex, isCorrect, xpAwarded },
      });

      const progress = await tx.userProgress.upsert({
        where: { userId },
        update: {
          xp: { increment: xpAwarded },
          completedLessons: { push: lessonId },
          lastLessonId: lessonId,
          lastUserAnswer: selectedIndex,
          lastWasCorrect: isCorrect,
          lastXpEarned: xpAwarded,
        },
        create: {
          userId,
          xp: xpAwarded,
          completedLessons: [lessonId],
          lastLessonId: lessonId,
          lastUserAnswer: selectedIndex,
          lastWasCorrect: isCorrect,
          lastXpEarned: xpAwarded,
        },
      });

      return { attempt, progress };
    });

    res.json(result);
  } catch {
    res.status(409).json({ error: "Already attempted" });
  }
});


// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDoc));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`Swagger UI on http://localhost:${PORT}/docs`);
});
