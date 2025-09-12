/*
  Warnings:

  - You are about to drop the column `role` on the `Node` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Node" DROP COLUMN "role",
ADD COLUMN     "roles" "public"."NodeRole"[] DEFAULT ARRAY[]::"public"."NodeRole"[];
