import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

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

const progress = {
  userId: "demo",
  xp: 20,
  completedLessons: ["lesson-1"],
};

// ROUTES
app.get("/api/courses", (_req, res) => {
  res.json([course]);
});

app.get("/api/courses/:courseId", (_req, res) => {
  res.json(course);
});

app.get("/api/lessons/:lessonId", (_req, res) => {
  res.json(lesson);
});

app.get("/api/dictionary", (_req, res) => {
  res.json(dictionary);
});

app.get("/api/progress/:userId", (_req, res) => {
  res.json(progress);
});

// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDoc));

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`📚 Swagger UI on http://localhost:${PORT}/docs`);
});
