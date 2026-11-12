const { Client } = require('pg');
const client = new Client({ 
  connectionString: 'postgresql://mentormatch:vhsl54Y4rlI24TZPNl27oC4eA7Y8QI9Z@dpg-dbpoc0o8v5cc73e0p1b0-a.oregon-postgres.render.com/mentormatch_nwqz',
  ssl: { rejectUnauthorized: false } 
});

client.connect().then(async () => {
  // 1. Create a sequence for the id
  await client.query("CREATE SEQUENCE IF NOT EXISTS sessions_id_seq");
  
  // 2. Attach the sequence to the id column
  await client.query("ALTER TABLE sessions ALTER COLUMN id SET DEFAULT nextval('sessions_id_seq')");
  
  // 3. Make sure the sequence starts after the highest existing id
  await client.query("SELECT setval('sessions_id_seq', COALESCE((SELECT MAX(id) FROM sessions), 0) + 1, false)");
  
  console.log("✅ Sessions id column is now auto-incrementing!");
  
  await client.end();
}).catch(err => { console.error(err); process.exit(1); });