const { Client } = require('pg');
const client = new Client({ 
  connectionString: 'postgresql://mentormatch:vhsl54Y4rlI24TZPNl27oC4eA7Y8QI9Z@dpg-dbpoc0o8v5cc73e0p1b0-a.oregon-postgres.render.com/mentormatch_nwqz',
  ssl: { rejectUnauthorized: false } 
});

client.connect().then(async () => {
  console.log("Connected...");

  // We know from the error log that Faith is ID 6 and Dadray is ID 4
  const menteeId = 6;
  const mentorId = 4;
  
  // The error said semester_id cannot be null, so we explicitly set it to 1
  const semesterId = 1; 

  console.log(`Using Mentee ID: ${menteeId}, Mentor ID: ${mentorId}, Semester ID: ${semesterId}`);

  // 1. Insert a completed session
  await client.query(`
    INSERT INTO sessions 
    (mentee_id, mentor_id, semester_id, course_code, session_date, duration_minutes, total_amount, admin_fee, mentor_payout, status, payment_status)
    VALUES 
    ($1, $2, $3, 'CSC101', NOW() - INTERVAL '2 days', 60, 100.00, 5.00, 95.00, 'completed', 'paid_to_admin')
  `, [menteeId, mentorId, semesterId]);

  // 2. Insert an upcoming session
  await client.query(`
    INSERT INTO sessions 
    (mentee_id, mentor_id, semester_id, course_code, session_date, duration_minutes, total_amount, admin_fee, mentor_payout, status, payment_status)
    VALUES 
    ($1, $2, $3, 'CSC101', NOW() + INTERVAL '2 days', 60, 100.00, 5.00, 95.00, 'confirmed', 'paid_to_admin')
  `, [menteeId, mentorId, semesterId]);

  // 3. Insert a feedback entry
  const sessionRes = await client.query("SELECT id FROM sessions WHERE mentee_id = $1 LIMIT 1", [menteeId]);
  if (sessionRes.rows.length > 0) {
    await client.query(`
      INSERT INTO feedback (session_id, mentee_id, mentor_id, rating, comments)
      VALUES ($1, $2, $3, 5, 'Great session!')
    `, [sessionRes.rows[0].id, menteeId, mentorId]);
  }

  console.log("✅ Successfully inserted test sessions and feedback!");
  await client.end();
}).catch(err => { console.error(err); process.exit(1); });