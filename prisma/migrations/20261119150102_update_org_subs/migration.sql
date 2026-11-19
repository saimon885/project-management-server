-- AlterTable
ALTER TABLE "organization_subscriptions" ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING';
