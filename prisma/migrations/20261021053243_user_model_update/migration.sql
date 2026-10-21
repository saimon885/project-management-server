/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "authProviderName" AS ENUM ('GOOGLE', 'CREDENTIALS');

-- CreateEnum
CREATE TYPE "userStatus" AS ENUM ('ACTIVE', 'BLOCKED', 'DELETED');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "authProvider" "authProviderName" NOT NULL DEFAULT 'CREDENTIALS',
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "status" "userStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");
