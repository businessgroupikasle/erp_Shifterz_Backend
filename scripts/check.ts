import { db } from './src/lib/db.js';
async function main() {
  const invs = await db.invoice.findMany();
  console.log('ALL INVOICES:', invs.map(i => i.id));
}
main().catch(console.error).finally(() => process.exit(0));
