const { Client } = require('pg');
const client = new Client({ 
  connectionString: 'postgresql://mentormatch:vhsl54Y4rlI24TZPNl27oC4eA7Y8QI9Z@dpg-dbpoc0o8v5cc73e0p1b0-a.oregon-postgres.render.com/mentormatch_nwqz',
  ssl: { rejectUnauthorized: false } 
});

client.connect().then(async () => {
  // Check if a semester exists
  const existing = await client.query("SELECT id FROM semesters LIMIT 1");
  
  if (existing.rows.length > 0) {
    console.log("✅ Semester already exists with ID:", existing.rows[0].id);
  } else {
    // Create a new semester
    const result = await client.query(`
      INSERT INTO semesters (semester_name, status, start_date, end_date)
      VALUES ('Semester 1', 'active', NOW(), NOW() + INTERVAL '6 months')
      RETURNING id
    `);
    console.log("✅ Created new semester with ID:", result.rows[0].id);
  }
  
  await client.end();
}).catch(err => { console.error(err); process.exit(1); });