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

  console.log("✅ Seed done");
}

  await prisma.sign.createMany({
  data: [
    {
      word: "Bonjour",
      description: "Salutation utilisée en journée.",
      videoUrl: "/videos/bonjour.mp4",
      category: "Salutations",
      difficulty: "facile",
    },
    {
      word: "Merci",
      description: "Exprime la gratitude.",
      videoUrl: "/videos/merci.mp4",
      category: "Politesse",
      difficulty: "facile",
    },
    {
      word: "Au revoir",
      description: "Pour se quitter.",
      videoUrl: "/videos/aurevoir.mp4",
      category: "Salutations",
      difficulty: "facile",
    },
  ],
  skipDuplicates: true,
});


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
