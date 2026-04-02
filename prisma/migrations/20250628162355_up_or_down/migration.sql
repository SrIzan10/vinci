/*
  Warnings:

  - Added the required column `upDown` to the `Suggestion` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Suggestion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "msgId" TEXT NOT NULL,
    "upDown" INTEGER NOT NULL
);
INSERT INTO "new_Suggestion" ("id", "msgId", "userId") SELECT "id", "msgId", "userId" FROM "Suggestion";
DROP TABLE "Suggestion";
ALTER TABLE "new_Suggestion" RENAME TO "Suggestion";
CREATE UNIQUE INDEX "Suggestion_userId_key" ON "Suggestion"("userId");
CREATE UNIQUE INDEX "Suggestion_msgId_key" ON "Suggestion"("msgId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
