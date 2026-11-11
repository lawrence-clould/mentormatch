const { Client } = require('pg');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Paste your External Database URL here: ', async (url) => {
  const client = new Client({ connectionString: url.trim(), ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    console.log('Connected! Forcing all tables to have a "status" column...');
    
    const tables = [
      'users', 
      'sessions', 
      'mentor_applications', 
      'mentor_availability', 
      'mentor_rates', 
      'mentees_enrollments', 
      'courses', 
      'certificates', 
      'feedback', 
      'payments', 
      'payout_requests', 
      'subscriptions', 
      'semesters'
    ];

    for (const table of tables) {
      try {
        await client.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';`);
        console.log(`✅ Checked ${table}`);
      } catch (e) {
        // Ignore if table doesn't exist
      }
    }

    // Ensure the courses table is perfectly formatted for the dropdown
    await client.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_code VARCHAR(50);`);
    await client.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_name VARCHAR(255);`);

    console.log('Success! All tables updated.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
    rl.close();
  }
});