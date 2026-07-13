const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    orderBy: { id: 'desc' },
    take: 5
  });
  console.log("LAST 5 USERS:", users.map(u => ({ id: u.id, username: u.username, franchiseId: u.franchiseId })));
  const franchises = await prisma.franchise.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1
  }).catch(() => null);
  console.log("LAST FRANCHISE:", franchises);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
