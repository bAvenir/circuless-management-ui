-- CreateEnum
CREATE TYPE "ParthershipStatus" AS ENUM ('APPROVED', 'PENDING');

-- CreateTable
CREATE TABLE "Partnership" (
    "id" TEXT NOT NULL,
    "status" "ParthershipStatus" NOT NULL DEFAULT 'PENDING',
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partnership_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Partnership" ADD CONSTRAINT "Partnership_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partnership" ADD CONSTRAINT "Partnership_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
