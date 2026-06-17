import { db } from "./src/lib/db.js";

async function check() {
  const techs = await db.technician.findMany();
  console.log("Technicians in DB:");
  techs.forEach(t => console.log(t.username, t.password ? "Has password" : "No password"));
  
  const user = await db.user.findMany();
  console.log("Users in DB:");
  user.forEach(u => console.log(u.username));
}

check().then(() => process.exit(0)).catch(e => console.error(e));
