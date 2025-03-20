/*
  Warnings:

  - A unique constraint covering the columns `[fromId,toId]` on the table `Partnership` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[toId,fromId]` on the table `Partnership` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Partnership_fromId_toId_key" ON "Partnership"("fromId", "toId");

-- CreateIndex
CREATE UNIQUE INDEX "Partnership_toId_fromId_key" ON "Partnership"("toId", "fromId");
