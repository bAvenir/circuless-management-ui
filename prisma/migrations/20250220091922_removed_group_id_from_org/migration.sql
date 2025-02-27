/*
  Warnings:

  - You are about to drop the column `groupId` on the `Organisation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,realm]` on the table `Organisation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Organisation" DROP COLUMN "groupId";

-- CreateIndex
CREATE UNIQUE INDEX "Organisation_name_realm_key" ON "Organisation"("name", "realm");
