/*
  Warnings:

  - You are about to drop the column `endDate` on the `organization_subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `organization_subscriptions` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'INITIATED', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('BKASH', 'STRIPE');

-- AlterTable
ALTER TABLE "organization_subscriptions" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "currentPeriodEnd" TIMESTAMP(3),
ADD COLUMN     "currentPeriodStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "provider" "PaymentProvider" NOT NULL DEFAULT 'BKASH',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "merchantInvoiceNumber" TEXT NOT NULL,
    "bkashPaymentID" TEXT,
    "bkashTrxID" TEXT,
    "failureReason" TEXT,
    "paidAt" TIMESTAMP(3),
    "subscriptionStartAt" TIMESTAMP(3),
    "subscriptionEndAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_merchantInvoiceNumber_key" ON "payments"("merchantInvoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "payments_bkashPaymentID_key" ON "payments"("bkashPaymentID");

-- CreateIndex
CREATE UNIQUE INDEX "payments_bkashTrxID_key" ON "payments"("bkashTrxID");

-- CreateIndex
CREATE INDEX "payments_organizationId_status_idx" ON "payments"("organizationId", "status");

-- CreateIndex
CREATE INDEX "payments_organizationId_createdAt_idx" ON "payments"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "payments_userId_idx" ON "payments"("userId");

-- CreateIndex
CREATE INDEX "organization_subscriptions_status_currentPeriodEnd_idx" ON "organization_subscriptions"("status", "currentPeriodEnd");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
