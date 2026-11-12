const { Client } = require('pg');
const client = new Client({ 
  connectionString: 'postgresql://mentormatch:vhsl54Y4rlI24TZPNl27oC4eA7Y8QI9Z@dpg-dbpoc0o8v5cc73e0p1b0-a.oregon-postgres.render.com/mentormatch_nwqz',
  ssl: { rejectUnauthorized: false } 
});

client.connect().then(async () => {
  const cols = await client.query(
    "SELECT column_name, is_nullable, data_type, column_default FROM information_schema.columns WHERE table_name = 'sessions'"
  );
  console.log('=== ALL SESSIONS COLUMNS ===');
  console.table(cols.rows);
  
  await client.end();
}).catch(err => { console.error(err); process.exit(1); });