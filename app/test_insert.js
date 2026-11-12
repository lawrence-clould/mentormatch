const { Client } = require('pg');
const client = new Client({ 
  connectionString: 'postgresql://mentormatch:vhsl54Y4rlI24TZPNl27oC4eA7Y8QI9Z@dpg-dbpoc0o8v5cc73e0p1b0-a.oregon-postgres.render.com/mentormatch_nwqz',
  ssl: { rejectUnauthorized: false } 
});

client.connect().then(async () => {
  try {
    // Try the exact same insert as the API
    const result = await client.query(`
      INSERT INTO sessions 
      (mentee_id, mentor_id, semester_id, course_code, session_date, duration_minutes, mentor_rate, total_amount, admin_fee, mentor_payout, status, payment_status)
      VALUES 
      (8, 4, 1, 'CSC101', '2026-11-15T10:00:00', 60, 100, 100, 5, 95, 'pending', 'pending')
      RETURNING id
    `);
    console.log("✅ SUCCESS! Inserted session with ID:", result.rows[0].id);
  } catch (error) {
    console.error("❌ INSERT FAILED:");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error detail:", error.detail);
  }
  
  await client.end();
}).catch(err => { console.error(err); process.exit(1); });