-- CreateEnum
CREATE TYPE "Realm" AS ENUM ('master', 'circuless');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('en', 'sk');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('INACTIVE', 'ACTIVE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "givenName" TEXT,
    "familyName" TEXT,
    "realm" "Realm" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'INACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_realm_key" ON "User"("email", "realm");
