/*
  Warnings:

  - Made the column `image_url` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "users_email_idx";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "imagePublishedID" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "image_url" SET NOT NULL,
ALTER COLUMN "image_url" SET DEFAULT '';

-- CreateIndex
CREATE INDEX "users_email_password_id_idx" ON "users"("email", "password", "id");
