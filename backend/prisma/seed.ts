import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is missing");

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.lesson.upsert({
    where: { id: "lesson-1" },
    update: {},
    create: {
      id: "lesson-1",
      title: "Dire bonjour",
      videoUrl: "/videos/bonjour.mp4",
      question: "Que signifie ce signe ?",
      choices: ["Bonjour", "Merci", "Au revoir"],
      correctIndex: 0,
    },
  });

  // (optionnel) crée un progress demo
  await prisma.userProgress.upsert({
    where: { userId: "demo" },
    update: {},
    create: {
      userId: "demo",
      xp: 0,
      completedLessons: [],
    },
  });

  console.log("✅ Seed done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
