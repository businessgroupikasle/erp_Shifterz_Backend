const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');
require('dotenv').config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Find all attendance records
  const attendances = await prisma.attendance.findMany();
  // Find all employee IDs
  const employees = await prisma.employee.findMany({ select: { id: true } });
  const empIds = new Set(employees.map(e => e.id));

  // Find orphans
  const orphans = attendances.filter(a => !empIds.has(a.employeeId));
  console.log(`Found ${orphans.length} orphan attendance records.`);

  if (orphans.length > 0) {
    const orphanIds = orphans.map(o => o.id);
    const deleted = await prisma.attendance.deleteMany({
      where: {
        id: { in: orphanIds }
      }
    });
    console.log(`Deleted ${deleted.count} orphan attendance records.`);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
