-- CreateTable
CREATE TABLE "GameAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "xpAwarded" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameAttempt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GameAttempt" ADD CONSTRAINT "GameAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProgress"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
