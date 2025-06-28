-- CreateTable
CREATE TABLE "Suggestion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "msgId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Suggestion_userId_key" ON "Suggestion"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Suggestion_msgId_key" ON "Suggestion"("msgId");
