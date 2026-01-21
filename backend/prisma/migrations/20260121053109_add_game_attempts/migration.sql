-- DropForeignKey
ALTER TABLE "GameAttempt" DROP CONSTRAINT "GameAttempt_userId_fkey";

-- CreateIndex
CREATE INDEX "GameAttempt_userId_gameId_idx" ON "GameAttempt"("userId", "gameId");

-- AddForeignKey
ALTER TABLE "GameAttempt" ADD CONSTRAINT "GameAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProgress"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
