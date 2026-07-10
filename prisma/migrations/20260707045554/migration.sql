-- CreateTable
CREATE TABLE "UserPermission" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "modules" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "role" TEXT NOT NULL,
    "permissions" TEXT[],

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("role")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPermission_employeeId_key" ON "UserPermission"("employeeId");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
