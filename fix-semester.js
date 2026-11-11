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
    console.log('Connected! Fixing semesters and other potential registration columns...');
    
    // 1. Fix the semesters table
    await client.query(`ALTER TABLE semesters ADD COLUMN IF NOT EXISTS semester_name VARCHAR(100);`);
    await client.query(`UPDATE semesters SET semester_name = name WHERE semester_name IS NULL AND name IS NOT NULL;`);

    // 2. Ensure courses has everything it needs (just in case)
    await client.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_code VARCHAR(50);`);
    await client.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_name VARCHAR(255);`);

    // 3. Ensure users has the correct year and programme columns
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS programme VARCHAR(100);`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS year_of_study VARCHAR(50);`);

    // 4. Add sample semesters and courses so the dropdowns aren't empty
    await client.query(`
      INSERT INTO semesters (semester_name) VALUES ('Semester 1'), ('Semester 2') ON CONFLICT DO NOTHING;
    `);
    await client.query(`
      INSERT INTO courses (course_name, course_code) VALUES 
      ('Computer Science', 'CS101'), ('Business', 'BA201'), ('Engineering', 'ENG301')
      ON CONFLICT DO NOTHING;
    `);

    console.log('Success! Database updated for registration.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
    rl.close();
  }
});