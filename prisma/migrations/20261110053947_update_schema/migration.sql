-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_createdById_fkey";

-- CreateIndex
CREATE INDEX "Team_createdById_idx" ON "Team"("createdById");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
