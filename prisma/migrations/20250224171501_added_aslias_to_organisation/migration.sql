/*
  Warnings:

  - Added the required column `alias` to the `Organisation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organisation" ADD COLUMN     "alias" TEXT NOT NULL;
