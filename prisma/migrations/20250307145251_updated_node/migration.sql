/*
  Warnings:

  - The values [DIRECT,WIREGUARD] on the enum `NodeAccess` will be removed. If these variants are still used in the database, this will fail.
  - The values [DISCOVERY,REGISTRY] on the enum `NodeRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NodeAccess_new" AS ENUM ('direct', 'wireguard');
ALTER TABLE "Node" ALTER COLUMN "access" DROP DEFAULT;
ALTER TABLE "Node" ALTER COLUMN "access" TYPE "NodeAccess_new" USING ("access"::text::"NodeAccess_new");
ALTER TYPE "NodeAccess" RENAME TO "NodeAccess_old";
ALTER TYPE "NodeAccess_new" RENAME TO "NodeAccess";
DROP TYPE "NodeAccess_old";
ALTER TABLE "Node" ALTER COLUMN "access" SET DEFAULT 'direct';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "NodeRole_new" AS ENUM ('discovery', 'registry');
ALTER TABLE "Node" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Node" ALTER COLUMN "role" TYPE "NodeRole_new"[] USING ("role"::text::"NodeRole_new"[]);
ALTER TYPE "NodeRole" RENAME TO "NodeRole_old";
ALTER TYPE "NodeRole_new" RENAME TO "NodeRole";
DROP TYPE "NodeRole_old";
ALTER TABLE "Node" ALTER COLUMN "role" SET DEFAULT ARRAY[]::"NodeRole"[];
COMMIT;

-- AlterTable
ALTER TABLE "Node" ALTER COLUMN "access" SET DEFAULT 'direct',
ALTER COLUMN "role" SET DEFAULT ARRAY[]::"NodeRole"[];
