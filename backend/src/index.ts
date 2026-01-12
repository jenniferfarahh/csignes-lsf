import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { prisma } from "./prisma";


const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

// Middlewares
app.use(cors({ origin: true }));
app.use(express.json());

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

app.get("/api/progress/:userId", async (req, res) => {
  const { userId } = req.params;

  const p = await prisma.userProgress.upsert({
    where: { userId },
    update: {},
    create: { userId, xp: 0, completedLessons: [] },
  });

  res.json(p);
});

app.get("/api/progress/:userId/lesson/:lessonId/attempt", async (req, res) => {
  const { userId, lessonId } = req.params;

  const attempt = await prisma.lessonAttempt.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });

  if (!attempt) return res.status(404).json({ error: "No attempt" });

  res.json(attempt);
});

app.post("/api/attempts", async (req, res) => {
  const { userId, lessonId, selectedIndex } = req.body as {
    userId?: string;
    lessonId?: string;
    selectedIndex?: number;
  };

  if (!userId || !lessonId || typeof selectedIndex !== "number") {
    return res.status(400).json({ error: "userId, lessonId, selectedIndex are required" });
  }

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) return res.status(404).json({ error: "Lesson not found" });

  const isCorrect = selectedIndex === lesson.correctIndex;
  const xpAwarded = isCorrect ? 10 : 0;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1) créer attempt (bloque si déjà existe grâce au @@unique)
      const attempt = await tx.lessonAttempt.create({
        data: { userId, lessonId, selectedIndex, isCorrect, xpAwarded },
      });

      // 2) update progress
      const progress = await tx.userProgress.upsert({
        where: { userId },
        update: {
          xp: { increment: xpAwarded },
          lastLessonId: lessonId,
          lastUserAnswer: selectedIndex,
          lastWasCorrect: isCorrect,
          lastXpEarned: xpAwarded,
          completedLessons: lessonId ? { push: lessonId } : undefined,
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

    return res.json(result);
  } catch (e: any) {
    // unique constraint => déjà tenté
    return res.status(409).json({ error: "Already attempted" });
  }
});

// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDoc));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`Swagger UI on http://localhost:${PORT}/docs`);
});
