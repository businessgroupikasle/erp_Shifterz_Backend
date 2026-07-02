/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Technician` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "authorizedSignatory" TEXT,
ADD COLUMN     "bankDetails" TEXT,
ADD COLUMN     "deliveryTerms" TEXT,
ADD COLUMN     "items" JSONB,
ADD COLUMN     "paymentTerms" TEXT;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "photos" TEXT[],
ADD COLUMN     "technicianId" TEXT;

-- AlterTable
ALTER TABLE "Setting" ADD COLUMN     "categories" TEXT[],
ADD COLUMN     "securityGuards" TEXT[];

-- AlterTable
ALTER TABLE "Technician" ADD COLUMN     "password" TEXT,
ADD COLUMN     "username" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Technician_username_key" ON "Technician"("username");
