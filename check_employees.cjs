const { Client } = require('pg');
async function main() {
  const client = new Client('postgresql://shifterz:shifterz@127.0.0.1:5432/shifterz?schema=public');
  try {
    await client.connect();
    const res = await client.query('SELECT id, name, username, role, "franchiseId" FROM "Employee" ORDER BY id ASC LIMIT 20');
    console.log("EMPLOYEES IN DB:");
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
main();
