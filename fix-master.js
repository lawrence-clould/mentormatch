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
    console.log('Connected! Applying master fixes...');
    
    // 1. Drop NOT NULL constraints so registration doesn't fail on empty columns
    await client.query(`ALTER TABLE users ALTER COLUMN full_name DROP NOT NULL;`);
    await client.query(`ALTER TABLE users ALTER COLUMN name DROP NOT NULL;`);

    // 2. Add missing columns to users table
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'mentee';`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);`);

    // 3. Add missing columns to semesters table
    await client.query(`ALTER TABLE semesters ADD COLUMN IF NOT EXISTS semester_name VARCHAR(100);`);
    await client.query(`ALTER TABLE semesters ADD COLUMN IF NOT EXISTS name VARCHAR(100);`);

    // 4. Add missing columns to courses table
    await client.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_name VARCHAR(255);`);
    await client.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS name VARCHAR(255);`);
    await client.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_code VARCHAR(50);`);

    console.log('Success! Master database update complete.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
    rl.close();
  }
});