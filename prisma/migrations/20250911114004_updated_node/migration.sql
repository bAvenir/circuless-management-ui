/*
  Warnings:

  - You are about to drop the column `csr` on the `Node` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."NodeStatus" AS ENUM ('approved', 'pending');

-- DropIndex
DROP INDEX "public"."Node_csr_key";

-- AlterTable
ALTER TABLE "public"."Node" DROP COLUMN "csr",
ADD COLUMN     "status" "public"."NodeStatus" NOT NULL DEFAULT 'pending';
