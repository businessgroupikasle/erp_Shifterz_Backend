import { db } from "./lib/db.js";

async function main() {
  const users = await db.user.findMany({
    orderBy: { id: 'desc' },
    take: 5
  });
  console.log("USERS IN DB:", users);
}

main().then(() => process.exit(0));
