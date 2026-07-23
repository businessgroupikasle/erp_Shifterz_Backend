/*
  Warnings:

  - The `deletedAt` column on the `Appointment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `clockIn` column on the `Attendance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `clockOut` column on the `Attendance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deletedAt` column on the `Attendance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `outTime` column on the `CarIn` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deletedAt` column on the `CarIn` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deletedAt` column on the `Customer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deletedAt` column on the `Employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deletedAt` column on the `Franchise` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deletedAt` column on the `Inventory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deletedAt` column on the `InventoryRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deletedAt` column on the `Invoice` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `actualCompletion` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deletedAt` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deletedAt` column on the `Lead` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deletedAt` column on the `MemberTransferRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deletedAt` column on the `OutPass` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deletedAt` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deletedAt` column on the `Service` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deletedAt` column on the `Setting` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `scheduledDate` on the `Appointment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `date` on the `Attendance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `inTime` on the `CarIn` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `lastVisit` on the `Customer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `since` on the `Franchise` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `date` on the `InventoryRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `date` on the `Invoice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `dueDate` on the `Invoice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `startDate` on the `Job` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `estCompletion` on the `Job` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `date` on the `Lead` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `date` on the `MemberTransferRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `outTime` on the `OutPass` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `date` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "scheduledDate",
ADD COLUMN     "scheduledDate" TIMESTAMP(3) NOT NULL,
DROP COLUMN "deletedAt",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
DROP COLUMN "clockIn",
ADD COLUMN     "clockIn" TIMESTAMP(3),
DROP COLUMN "clockOut",
ADD COLUMN     "clockOut" TIMESTAMP(3),
DROP COLUMN "deletedAt",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "CarIn" DROP COLUMN "inTime",
ADD COLUMN     "inTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "outTime",
ADD COLUMN     "outTime" TIMESTAMP(3),
DROP COLUMN "deletedAt",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "lastVisit",
ADD COLUMN     "lastVisit" TIMESTAMP(3) NOT NULL,
DROP COLUMN "deletedAt",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "deletedAt",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Franchise" DROP COLUMN "since",
ADD COLUMN     "since" TIMESTAMP(3) NOT NULL,
DROP COLUMN "deletedAt",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "deletedAt",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "InventoryRequest" DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
DROP COLUMN "deletedAt",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "cancelledBy" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "modifiedBy" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
DROP COLUMN "dueDate",
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
DROP COLUMN "deletedAt",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "startDate",
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
DROP COLUMN "estCompletion",
ADD COLUMN     "estCompletion" TIMESTAMP(3) NOT NULL,
DROP COLUMN "actualCompletion",
ADD COLUMN     "actualCompletion" TIMESTAMP(3),
DROP COLUMN "deletedAt",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
DROP COLUMN "deletedAt",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "MemberTransferRequest" DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
DROP COLUMN "deletedAt",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "OutPass" DROP COLUMN "outTime",
ADD COLUMN     "outTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "deletedAt",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
DROP COLUMN "deletedAt",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "deletedAt",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Setting" DROP COLUMN "deletedAt",
ADD COLUMN     "deletedAt" TIMESTAMP(3);
