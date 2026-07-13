const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();
async function main() {
  const franchises = await db.franchise.findMany();
  console.log('FRANCHISES:', franchises);
}
main().catch(console.error).finally(() => db.$disconnect());
