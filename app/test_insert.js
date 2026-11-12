const { Client } = require('pg');
const client = new Client({ 
  connectionString: 'postgresql://mentormatch:vhsl54Y4rlI24TZPNl27oC4eA7Y8QI9Z@dpg-dbpoc0o8v5cc73e0p1b0-a.oregon-postgres.render.com/mentormatch_nwqz',
  ssl: { rejectUnauthorized: false } 
});

client.connect().then(async () => {
  // 1. Check if a semester exists
  const sem = await client.query("SELECT id FROM semesters LIMIT 1");
  if (sem.rows.length === 0) {
    console.log("❌ No semester found. Please run create_semester.js first.");
    process.exit(1);
  }
  const semesterId = sem.rows[0].id;
  console.log("✅ Found semester ID:", semesterId);

  // 2. Try to insert a session
  try {
    const result = await client.query(`
      INSERT INTO sessions 
      (mentee_id, mentor_id, semester_id, course_code, session_date, duration_minutes, mentor_rate, total_amount, admin_fee, mentor_payout, status, payment_status)
      VALUES 
      (8, 4, $1, 'CSC101', NOW() + INTERVAL '1 day', 60, 100, 100, 5, 95, 'pending', 'pending')
      RETURNING id
    `, [semesterId]);
    console.log("✅ INSERT SUCCESSFUL! Session ID:", result.rows[0].id);
  } catch (err) {
    console.error("❌ INSERT FAILED:", err.message);
  }

  await client.end();
}).catch(err => { console.error(err); process.exit(1); });