/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Sign` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Sign` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[word,category]` on the table `Sign` will be added. If there are existing duplicate values, this will fail.
  - Made the column `description` on table `Sign` required. This step will fail if there are existing NULL values in that column.
  - Made the column `category` on table `Sign` required. This step will fail if there are existing NULL values in that column.
  - Made the column `difficulty` on table `Sign` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Sign_category_idx";

-- DropIndex
DROP INDEX "Sign_word_idx";

-- AlterTable
ALTER TABLE "Sign" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "difficulty" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Sign_word_category_key" ON "Sign"("word", "category");
