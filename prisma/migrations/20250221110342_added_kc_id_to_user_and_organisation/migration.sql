/*
  Warnings:

  - A unique constraint covering the columns `[kcId]` on the table `Organisation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kcId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `kcId` to the `Organisation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kcId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organisation" ADD COLUMN     "kcId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "kcId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Organisation_kcId_key" ON "Organisation"("kcId");

-- CreateIndex
CREATE UNIQUE INDEX "User_kcId_key" ON "User"("kcId");
