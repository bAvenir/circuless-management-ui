/*
  Warnings:

  - The values [APPROVED] on the enum `ParthershipStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ParthershipStatus_new" AS ENUM ('ACTIVE', 'PENDING');
ALTER TABLE "Partnership" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Partnership" ALTER COLUMN "status" TYPE "ParthershipStatus_new" USING ("status"::text::"ParthershipStatus_new");
ALTER TYPE "ParthershipStatus" RENAME TO "ParthershipStatus_old";
ALTER TYPE "ParthershipStatus_new" RENAME TO "ParthershipStatus";
DROP TYPE "ParthershipStatus_old";
ALTER TABLE "Partnership" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
