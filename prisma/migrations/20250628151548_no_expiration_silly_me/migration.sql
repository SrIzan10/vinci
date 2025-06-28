/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `Afk` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Afk" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "reason" TEXT NOT NULL
);
INSERT INTO "new_Afk" ("id", "reason", "userId") SELECT "id", "reason", "userId" FROM "Afk";
DROP TABLE "Afk";
ALTER TABLE "new_Afk" RENAME TO "Afk";
CREATE UNIQUE INDEX "Afk_userId_key" ON "Afk"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
