const { Client } = require('pg');
const client = new Client({ 
  connectionString: 'postgresql://mentormatch:vhsl54Y4rlI24TZPNl27oC4eA7Y8QI9Z@dpg-dbpoc0o8v5cc73e0p1b0-a.oregon-postgres.render.com/mentormatch_nwqz',
  ssl: { rejectUnauthorized: false } 
});

client.connect().then(async () => {
  console.log("Connected to Database. Injecting live data...");

  // 1. Ensure we have a semester
  const semRes = await client.query("SELECT id FROM semesters LIMIT 1");
  const semesterId = semRes.rows.length > 0 ? semRes.rows[0].id : 1;

  // 2. Insert 3 Sessions for Faith (Mentee 6) and Dadray (Mentor 4)
  await client.query(`
    INSERT INTO sessions 
    (mentee_id, mentor_id, semester_id, course_code, session_date, duration_minutes, mentor_rate, total_amount, admin_fee, mentor_payout, status, payment_status)
    VALUES 
    (6, 4, $1, 'CSC101', NOW() - INTERVAL '3 days', 60, 100, 100, 5, 95, 'completed', 'paid_to_admin'),
    (6, 4, $1, 'MAT101', NOW() + INTERVAL '2 days', 90, 150, 225, 11.25, 213.75, 'confirmed', 'paid_to_admin'),
    (6, 4, $1, 'CSC101', NOW() + INTERVAL '5 days', 60, 100, 100, 5, 95, 'pending', 'pending')
  `, [semesterId]);
  console.log("✅ 3 Sessions inserted.");

  // 3. Insert Payment Records
  await client.query(`
    INSERT INTO payments 
    (session_id, mentee_id, mentor_id, amount, admin_fee, mentor_payout, payment_status, transaction_reference)
    SELECT id, 6, 4, total_amount, admin_fee, mentor_payout, 'captured', 'TXN-' || floor(random() * 1000000)
    FROM sessions WHERE mentee_id = 6 AND mentor_id = 4 LIMIT 2
  `);
  console.log("✅ 2 Payments inserted.");

  // 4. Insert Feedback
  const firstSession = await client.query("SELECT id FROM sessions WHERE mentee_id = 6 AND status = 'completed' LIMIT 1");
  if (firstSession.rows.length > 0) {
    await client.query(`
      INSERT INTO feedback (session_id, mentee_id, mentor_id, rating, comments)
      VALUES ($1, 6, 4, 5, 'Excellent session, very helpful!')
    `, [firstSession.rows[0].id]);
    console.log("✅ 1 Feedback inserted.");
  }

  // 5. Add Mentor Rates
  await client.query(`
    INSERT INTO mentor_rates (mentor_id, course_code, rate_per_hour)
    VALUES (4, 'CSC101', 100), (4, 'MAT101', 150)
    ON CONFLICT (mentor_id, course_code) DO NOTHING
  `);
  console.log("✅ Mentor Rates updated.");

  await client.end();
  console.log("🎉 Database population complete! Refresh your browser.");
}).catch(err => { console.error(err); process.exit(1); });