-- CreateTable
CREATE TABLE "ai_chats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "messageid" TEXT NOT NULL,
    "threadid" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AIMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "aiChatId" INTEGER NOT NULL,
    CONSTRAINT "AIMessage_aiChatId_fkey" FOREIGN KEY ("aiChatId") REFERENCES "ai_chats" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
