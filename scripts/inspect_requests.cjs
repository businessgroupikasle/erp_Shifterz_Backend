const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const requests = await prisma.memberTransferRequest.findMany({
    orderBy: { createdAt: 'desc' }
  });
  console.log("--- MEMBER TRANSFER REQUESTS ---");
  requests.forEach(r => {
    console.log({
      id: r.id,
      name: r.newMemberName,
      status: r.status,
      username: r.username,
      password: r.password ? "[SET]" : "[NOT SET]",
      createdAt: r.createdAt
    });
  });

  const employees = await prisma.employee.findMany({
    orderBy: { id: 'desc' }
  });
  console.log("\n--- EMPLOYEES ---");
  employees.forEach(e => {
    console.log({
      id: e.id,
      name: e.name,
      username: e.username,
      status: e.status,
      role: e.role,
      franchiseId: e.franchiseId
    });
  });
}

main()
  .catch(console.error)
  .finally(() => {
    prisma.$disconnect();
    pool.end();
  });
