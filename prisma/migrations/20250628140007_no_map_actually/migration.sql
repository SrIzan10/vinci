/*
  Warnings:

  - You are about to drop the `ai_chats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ai_chats";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "AiChat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "messageid" TEXT NOT NULL,
    "threadid" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AiMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "aiChatId" INTEGER NOT NULL,
    CONSTRAINT "AiMessage_aiChatId_fkey" FOREIGN KEY ("aiChatId") REFERENCES "AiChat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AiMessage" ("aiChatId", "content", "id", "role") SELECT "aiChatId", "content", "id", "role" FROM "AiMessage";
DROP TABLE "AiMessage";
ALTER TABLE "new_AiMessage" RENAME TO "AiMessage";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
