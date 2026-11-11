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
    console.log('Connected! Fixing users table...');
    
    // Add 'name' column and copy data from 'full_name'
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);`);
    await client.query(`UPDATE users SET name = full_name WHERE name IS NULL;`);
    
    // Add 'password' column just in case, and copy from 'password_hash'
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);`);
    await client.query(`UPDATE users SET password = password_hash WHERE password IS NULL;`);

    console.log('Success! Users table updated.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
    rl.close();
  }
});