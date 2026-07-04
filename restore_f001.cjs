const { Client } = require('pg');
async function main() {
  const client = new Client('postgresql://shifterz:shifterz@127.0.0.1:5432/shifterz?schema=public');
  try {
    await client.connect();
    
    // Check if F001 exists
    const checkRes = await client.query('SELECT id FROM "Franchise" WHERE id = \'F001\'');
    if (checkRes.rows.length === 0) {
      console.log("Restoring F001 franchise...");
      await client.query(`
        INSERT INTO "Franchise" (id, name, city, owner, phone, since, revenue, jobs, "royaltyPct", status, "isDeleted") 
        VALUES ('F001', 'Shifterz Chennai', 'Chennai', 'Balaji S', '9840011111', '2024-06-01', 380000, 48, 0, 'Active', false)
      `);
      console.log("F001 franchise restored.");
    }
    
    // Re-link branchadmin
    console.log("Assigning branchadmin back to F001...");
    await client.query('UPDATE "Employee" SET "franchiseId" = \'F001\' WHERE username = \'branchadmin\'');
    console.log("branchadmin successfully assigned to F001!");
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
main();
