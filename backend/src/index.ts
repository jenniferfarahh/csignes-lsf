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
  title: "Bonjour, ça va ?, oui/non, au revoir.",
  steps: [
    {
      type: "video",
      videoUrl: "/videos/lesson 1/bonjour.mp4",
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
    videoUrl: "/videos/lesson 1/bonjour.mp4",
  },
];

// ROUTES
app.get("/api/courses", (_req, res) => {
  res.json([course]);
});

// GET all signs (for games)
app.get("/api/signs", requireAuth, async (_req, res) => {
  try {
    const signs = await prisma.sign.findMany({
      orderBy: { word: "asc" },
      select: {
        id: true,
        word: true,
        description: true,
        videoUrl: true,
        category: true,
        difficulty: true,
      },
    });

    res.json(signs);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load signs" });
  }
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


app.get("/api/dictionary", requireAuth, async (req, res) => {
  const q = String(req.query.q ?? "").trim();

  const signs = await prisma.sign.findMany({
    where: q
      ? {
          OR: [
            { word: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { word: "asc" },
  });

  res.json(signs);
});


app.post("/api/auth/google", async (req, res) => {
  try {
    const { idToken } = req.body as { idToken?: string };
    if (!idToken) return res.status(400).json({ error: "idToken missing" });

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const userId = payload.sub;

    const fullName = (payload.name ?? "").trim();
    const parts = fullName.split(/\s+/).filter(Boolean);
    const firstName = payload.given_name ?? parts[0] ?? null;
    const lastName =
      payload.family_name ?? (parts.length > 1 ? parts.slice(1).join(" ") : null);

    await prisma.user.upsert({
      where: { id: userId },
      update: {
        email: payload.email,
        firstName,
        lastName,
        picture: payload.picture ?? null,
      },
      create: {
        id: userId,
        email: payload.email,
        firstName,
        lastName,
        picture: payload.picture ?? null,
      },
    });

    await prisma.userProgress.upsert({
      where: { userId },
      update: {},
      create: { userId, xp: 0, completedLessons: [] },
    });

    return res.json({ accessToken: idToken });
  } catch (err) {
    console.error("Google auth error:", err);
    return res.status(500).json({ error: "Auth failed" });
  }
});

app.get("/api/me", requireAuth, async (req: any, res) => {
  const userId = req.userId;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, firstName: true, lastName: true, picture: true },
  });

  if (!user) return res.status(404).json({ error: "User not found" });
  return res.json(user);
});

app.get("/api/progress/me", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!;

  const progress = await prisma.userProgress.findUnique({
    where: { userId },
  });

  if (!progress) {
    return res.status(404).json({ error: "Progress not found" });
  }

  res.json(progress);
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

// backend/src/index.ts
// backend/src/index.ts
app.get("/api/history/week", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const from = String(req.query.from ?? "").trim(); // "YYYY-MM-DD"
    const to = String(req.query.to ?? "").trim(); // "YYYY-MM-DD"

    if (!from || !to) {
      return res.status(400).json({ error: "Missing from/to (YYYY-MM-DD)" });
    }

    // Helper: dateKey en UTC (cohérent avec frontend toISOString().slice(0,10))
    const toDateKeyUTC = (d: Date) => d.toISOString().slice(0, 10);

    const fromDate = new Date(`${from}T00:00:00.000Z`);
    const toDate = new Date(`${to}T23:59:59.999Z`);

    // 1) Attempts semaine (leçons + jeux)
    const lessonAttempts = await prisma.lessonAttempt.findMany({
      where: { userId, createdAt: { gte: fromDate, lte: toDate } },
      select: { createdAt: true, lessonId: true, isCorrect: true, xpAwarded: true },
      orderBy: { createdAt: "asc" },
    });

    const gameAttempts = await prisma.gameAttempt.findMany({
      where: { userId, createdAt: { gte: fromDate, lte: toDate } },
      select: { createdAt: true, gameId: true, score: true, xpAwarded: true },
      orderBy: { createdAt: "asc" },
    });

    // 2) User progress (XP + leçons terminées)
    const progress = await prisma.userProgress.findUnique({
      where: { userId },
      select: { xp: true, completedLessons: true },
    });

    // 3) Days[] sur la semaine [from..to]
    const lessonDaysSet = new Set(lessonAttempts.map((a) => toDateKeyUTC(a.createdAt)));
    const gameDaysSet = new Set(gameAttempts.map((a) => toDateKeyUTC(a.createdAt)));

    const days: Array<{
      date: string; // YYYY-MM-DD
      label: string; // L M M J V S D
      didActivity: boolean;
      isToday: boolean;
    }> = [];

    const labels = ["D", "L", "M", "M", "J", "V", "S"]; // getUTCDay(): 0=dimanche
    const todayKey = toDateKeyUTC(new Date());

    for (
      let d = new Date(fromDate);
      d.getTime() <= toDate.getTime();
      d = new Date(d.getTime() + 24 * 60 * 60 * 1000)
    ) {
      const key = toDateKeyUTC(d);
      const didActivity = lessonDaysSet.has(key) || gameDaysSet.has(key);

      days.push({
        date: key,
        label: labels[d.getUTCDay()],
        didActivity,
        isToday: key === todayKey,
      });
    }

    const activeDaysCount = days.filter((x) => x.didActivity).length;

    // 4) Streak (compter jours consécutifs jusqu’à aujourd’hui)
    // On regarde les 30 derniers jours d’activité (leçon + jeu)
    const last30 = new Date();
    last30.setUTCDate(last30.getUTCDate() - 30);

    const lastLesson = await prisma.lessonAttempt.findMany({
      where: { userId, createdAt: { gte: last30 } },
      select: { createdAt: true },
    });

    const lastGames = await prisma.gameAttempt.findMany({
      where: { userId, createdAt: { gte: last30 } },
      select: { createdAt: true },
    });

    const activitySet = new Set<string>();
    for (const a of lastLesson) activitySet.add(toDateKeyUTC(a.createdAt));
    for (const a of lastGames) activitySet.add(toDateKeyUTC(a.createdAt));

    let streakDays = 0;
    // streak: si aujourd’hui pas d’activité => streak 0
    // sinon on remonte jour par jour
    for (let i = 0; i < 365; i++) {
      const dt = new Date();
      dt.setUTCDate(dt.getUTCDate() - i);
      const key = toDateKeyUTC(dt);

      if (!activitySet.has(key)) break;
      streakDays++;
    }

    // 5) globalProgressPct (basé sur leçons terminées / total leçons)
    const totalLessons = await prisma.lesson.count();
    const completedLessonsCount = progress?.completedLessons?.length ?? 0;
    const globalProgressPct =
      totalLessons === 0 ? 0 : Math.round((completedLessonsCount / totalLessons) * 100);

    return res.json({
      days,
      activeDaysCount,
      streakDays,
      globalProgressPct,
      attempts: lessonAttempts,
      gameAttempts,
      xp: progress?.xp ?? 0,
      completedLessons: progress?.completedLessons ?? [],
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// ---------- helpers ----------
function dayKeyLocal(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  // YYYY-MM-DD local
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const dd = String(x.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function computeStreakFromDaySet(activeDays: Set<string>) {
  let streak = 0;
  const d = new Date();
  d.setHours(0, 0, 0, 0);

  while (true) {
    const k = dayKeyLocal(d);
    if (!activeDays.has(k)) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

// ---------- GAMES: complete ----------
app.post("/api/games/complete", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const { gameId, score } = req.body as { gameId?: string; score?: number };

  if (!gameId || typeof score !== "number") {
    return res.status(400).json({ error: "gameId and score required" });
  }

  // ✅ 1 essai par jeu (comme les leçons)
  const already = await prisma.gameAttempt.findFirst({ where: { userId, gameId } });
  if (already) return res.status(409).json({ error: "Already played" });

  // XP: simple et stable
  // score 0..100 => xp 0..20 (min 5 si >0)
  const xpAwarded = score <= 0 ? 0 : Math.max(5, Math.round((score / 100) * 20));

  const result = await prisma.$transaction(async (tx) => {
    const attempt = await tx.gameAttempt.create({
      data: { userId, gameId, score, xpAwarded },
    });

    const progress = await tx.userProgress.upsert({
      where: { userId },
      update: { xp: { increment: xpAwarded } },
      create: { userId, xp: xpAwarded, completedLessons: [] },
    });

    return { attempt, progress };
  });

  res.json({
    ok: true,
    gameId,
    score,
    xpAwarded,
    totalXp: result.progress.xp,
  });
});

// ---------- GAMES: stats ----------
app.get("/api/games/stats", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!;

  const attempts = await prisma.gameAttempt.findMany({
    where: { userId },
    select: { gameId: true, score: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const gamesCompleted = attempts.length;
  const avgScore =
    gamesCompleted === 0
      ? 0
      : Math.round(attempts.reduce((s, a) => s + a.score, 0) / gamesCompleted);

  // “défi du jour”: 5 mini-jeux joués aujourd’hui
  const todayKey = dayKeyLocal(new Date());
  const playedToday = new Set(
    attempts.filter((a) => dayKeyLocal(a.createdAt) === todayKey).map((a) => a.gameId)
  ).size;

  res.json({
    attempts,
    gamesCompleted,
    avgScore,
    badgesWon: Math.floor(gamesCompleted / 3), // simple (ex: 1 badge / 3 jeux)
    dailyTarget: 5,
    dailyProgress: Math.min(5, playedToday),
    playedGameIds: attempts.map((a) => a.gameId),
  });
});

// ---------- ACTIVITY: stats (leçons + jeux) ----------
app.get("/api/activity/stats", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!;

  const [lessonAttempts, gameAttempts, progress, totalLessons] = await Promise.all([
    prisma.lessonAttempt.findMany({
      where: { userId },
      select: { createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 3650,
    }),
    prisma.gameAttempt.findMany({
      where: { userId },
      select: { createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 3650,
    }),
    prisma.userProgress.findUnique({
      where: { userId },
      select: { xp: true, completedLessons: true },
    }),
    prisma.lesson.count(),
  ]);

  const activeDays = new Set<string>();
  for (const a of lessonAttempts) activeDays.add(dayKeyLocal(a.createdAt));
  for (const g of gameAttempts) activeDays.add(dayKeyLocal(g.createdAt));

  const streakDays = computeStreakFromDaySet(activeDays);

  const today = dayKeyLocal(new Date());
  const didActivityToday = activeDays.has(today);

  const completedLessons = progress?.completedLessons ?? [];
  const globalProgressPct =
    totalLessons <= 0 ? 0 : Math.min(100, Math.round((completedLessons.length / totalLessons) * 100));

  res.json({
    xp: progress?.xp ?? 0,
    streakDays,
    didActivityToday,
    completedLessonsCount: completedLessons.length,
    totalLessons,
    globalProgressPct,
    firstActivityUnlocked: activeDays.size > 0,
  });
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

// ---------- GAMES ----------
const DAILY_GAMES_TARGET = 5 as const;

function startOfTodayUTC() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
}



// POST attempt (sauvegarde score + ajoute XP) + bloque replay
app.post("/api/games/attempts", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const { gameId, score } = req.body as { gameId?: string; score?: number };

  if (!gameId || typeof score !== "number") {
    return res.status(400).json({ error: "gameId and score are required" });
  }

  // ✅ bloque replay (1 seule fois par jeu)
  const already = await prisma.gameAttempt.findFirst({
    where: { userId, gameId },
    select: { id: true },
  });
  if (already) return res.status(409).json({ error: "Already played" });

  // XP simple: score 0..100 -> 0..20 XP
  const xpAwarded = Math.max(0, Math.min(20, Math.round(score / 5)));

  const result = await prisma.$transaction(async (tx) => {
    const attempt = await tx.gameAttempt.create({
      data: { userId, gameId, score, xpAwarded },
    });

    const progress = await tx.userProgress.upsert({
      where: { userId },
      update: { xp: { increment: xpAwarded } },
      create: { userId, xp: xpAwarded, completedLessons: [] },
    });

    return { attempt, progress };
  });

  res.json({
    ok: true,
    gameId,
    score,
    xpAwarded,
    totalXp: result.progress.xp,
  });
});


// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDoc));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`Swagger UI on http://localhost:${PORT}/docs`);
});
