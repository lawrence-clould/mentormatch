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
    console.log('Connected! Adding missing columns...');
    
    // Add course_code to courses table
    await client.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_code VARCHAR(50);`);
    
    // Add some sample courses so the dropdown isn't empty!
    await client.query(`
      INSERT INTO courses (name, course_code) VALUES 
      ('Computer Science', 'CS101'),
      ('Business Administration', 'BA201'),
      ('Engineering', 'ENG301')
      ON CONFLICT DO NOTHING;
    `);

    console.log('Success! Database updated.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
    rl.close();
  }
});