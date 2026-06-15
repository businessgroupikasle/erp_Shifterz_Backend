const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.setting.findUnique({ where: { id: 'default' } });
  if (settings) {
    const existing = settings.categories || [];
    const toAdd = ['PPF', 'Coating', 'Detailing', 'Add-on', 'Consumable', 'Chemical'];
    const updated = Array.from(new Set([...existing, ...toAdd]));
    await prisma.setting.update({
      where: { id: 'default' },
      data: { categories: updated }
    });
    console.log('Successfully seeded categories!');
  } else {
    console.log('Settings not found');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
