/*
  Warnings:

  - Made the column `videoUrl` on table `Sign` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Sign" ALTER COLUMN "videoUrl" SET NOT NULL;
