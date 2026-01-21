-- CreateTable
CREATE TABLE "Sign" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT NOT NULL,
    "category" TEXT,
    "difficulty" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sign_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Sign_word_idx" ON "Sign"("word");

-- CreateIndex
CREATE INDEX "Sign_category_idx" ON "Sign"("category");
