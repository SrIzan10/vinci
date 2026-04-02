/*
  Warnings:

  - You are about to drop the `AIMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AIMessage";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "AiMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "aiChatId" INTEGER NOT NULL,
    CONSTRAINT "AiMessage_aiChatId_fkey" FOREIGN KEY ("aiChatId") REFERENCES "ai_chats" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
