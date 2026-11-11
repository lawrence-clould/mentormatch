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
    console.log('Connected! Fixing course_name column...');
    
    // Rename the column 'name' to 'course_name'
    await client.query(`ALTER TABLE courses RENAME COLUMN name TO course_name;`);

    console.log('Success! Column renamed. You can refresh the website now.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
    rl.close();
  }
});