/*
  Warnings:

  - You are about to drop the column `restrictions` on the `Node` table. All the data in the column will be lost.
  - You are about to drop the column `pvtkey` on the `NodeWireguard` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pubkey]` on the table `NodeWireguard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lighthouseId` to the `NodeWireguard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preshared` to the `NodeWireguard` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NodeRole" AS ENUM ('DISCOVERY', 'REGISTRY');

-- AlterTable
ALTER TABLE "Node" DROP COLUMN "restrictions",
ADD COLUMN     "role" "NodeRole"[] DEFAULT ARRAY['DISCOVERY']::"NodeRole"[];

-- AlterTable
ALTER TABLE "NodeWireguard" DROP COLUMN "pvtkey",
ADD COLUMN     "lighthouseId" TEXT NOT NULL,
ADD COLUMN     "preshared" TEXT NOT NULL;

-- DropEnum
DROP TYPE "NodeRestrictions";

-- CreateTable
CREATE TABLE "Lighthouse" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "pubkey" TEXT NOT NULL,
    "privkey" TEXT NOT NULL,
    "realm" "Realm" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lighthouse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lighthouse_host_realm_key" ON "Lighthouse"("host", "realm");

-- CreateIndex
CREATE UNIQUE INDEX "NodeWireguard_pubkey_key" ON "NodeWireguard"("pubkey");

-- AddForeignKey
ALTER TABLE "NodeWireguard" ADD CONSTRAINT "NodeWireguard_lighthouseId_fkey" FOREIGN KEY ("lighthouseId") REFERENCES "Lighthouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
