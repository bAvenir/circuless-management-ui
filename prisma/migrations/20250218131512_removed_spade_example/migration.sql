/*
  Warnings:

  - The values [spade] on the enum `Realm` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Realm_new" AS ENUM ('master', 'circuless');
ALTER TABLE "User" ALTER COLUMN "realm" TYPE "Realm_new" USING ("realm"::text::"Realm_new");
ALTER TYPE "Realm" RENAME TO "Realm_old";
ALTER TYPE "Realm_new" RENAME TO "Realm";
DROP TYPE "Realm_old";
COMMIT;
