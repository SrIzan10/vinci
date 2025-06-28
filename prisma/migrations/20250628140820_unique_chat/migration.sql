/*
  Warnings:

  - A unique constraint covering the columns `[messageid]` on the table `AiChat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[threadid]` on the table `AiChat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AiChat_messageid_key" ON "AiChat"("messageid");

-- CreateIndex
CREATE UNIQUE INDEX "AiChat_threadid_key" ON "AiChat"("threadid");
