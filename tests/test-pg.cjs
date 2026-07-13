const { Client } = require('pg');
const client = new Client('postgresql://shifterz:shifterz@localhost:5433/shifterz?schema=public');
client.connect()
  .then(() => Promise.all([
    client.query('SELECT COUNT(*) FROM "Inventory" WHERE "franchiseId" = \'FRA007\''),
    client.query('SELECT COUNT(*) FROM "Customer" WHERE "franchiseId" = \'FRA007\''),
  ]))
  .then(([inv, cust]) => console.log({
    inventoryCountFRA007: inv.rows[0].count,
    customerCountFRA007: cust.rows[0].count,
  }))
  .catch(console.error)
  .finally(() => client.end());
