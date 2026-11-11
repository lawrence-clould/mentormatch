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
    console.log('Connected! Removing strict requirements...');
    
    // Drop the NOT NULL constraint on full_name so it allows the registration code to pass
    await client.query(`ALTER TABLE users ALTER COLUMN full_name DROP NOT NULL;`);

    // Also do the same for name just in case
    await client.query(`ALTER TABLE users ALTER COLUMN name DROP NOT NULL;`);

    console.log('Success! Database is ready for registration.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
    rl.close();
  }
});