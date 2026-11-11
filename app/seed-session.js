const { Client } = require('pg');
const client = new Client({ 
  connectionString: 'postgresql://mentormatch:vhsl54Y4rlI24TZPNl27oC4eA7Y8QI9Z@dpg-dbpoc0o8v5cc73e0p1b0-a.oregon-postgres.render.com/mentormatch_nwqz',
  ssl: { rejectUnauthorized: false } 
});

client.connect().then(async () => {
  console.log("Connected...");

  // 1. Check if a semester exists. If not, create one.
  let semesterRes = await client.query("SELECT id FROM semesters LIMIT 1");
  let semesterId;

  if (semesterRes.rows.length === 0) {
    console.log("No semesters found. Creating one...");
    const newSemester = await client.query(`
      INSERT INTO semesters (semester_name, status, start_date, end_date)
      VALUES ('Semester 1', 'active', NOW(), NOW() + INTERVAL '6 months')
      RETURNING id
    `);
    semesterId = newSemester.rows[0].id;
    console.log(`✅ Created new semester with ID: ${semesterId}`);
  } else {
    semesterId = semesterRes.rows[0].id;
    console.log(`Found existing semester with ID: ${semesterId}`);
  }

  const menteeId = 6; // Faith Banda
  const mentorId = 4; // Dadray Mathotho

  // 2. Insert a completed session
  await client.query(`
    INSERT INTO sessions 
    (mentee_id, mentor_id, semester_id, course_code, session_date, duration_minutes, mentor_rate, total_amount, admin_fee, mentor_payout, status, payment_status)
    VALUES 
    ($1, $2, $3, 'CSC101', NOW() - INTERVAL '2 days', 60, 100.00, 100.00, 5.00, 95.00, 'completed', 'paid_to_admin')
  `, [menteeId, mentorId, semesterId]);

  // 3. Insert an upcoming session
  await client.query(`
    INSERT INTO sessions 
    (mentee_id, mentor_id, semester_id, course_code, session_date, duration_minutes, mentor_rate, total_amount, admin_fee, mentor_payout, status, payment_status)
    VALUES 
    ($1, $2, $3, 'CSC101', NOW() + INTERVAL '2 days', 60, 100.00, 100.00, 5.00, 95.00, 'confirmed', 'paid_to_admin')
  `, [menteeId, mentorId, semesterId]);

  // 4. Insert a feedback entry
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