/*
  Warnings:

  - You are about to drop the column `createdAt` on the `UserProgress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserProgress" DROP COLUMN "createdAt",
ADD COLUMN     "completedLessons" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "lastLessonId" TEXT,
ADD COLUMN     "lastUserAnswer" INTEGER,
ADD COLUMN     "lastWasCorrect" BOOLEAN,
ADD COLUMN     "lastXpEarned" INTEGER;
