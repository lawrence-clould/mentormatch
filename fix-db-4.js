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
    
    // Add status to users (defaults to active)
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';`);
    
    // Add status to mentor_applications (defaults to pending)
    await client.query(`ALTER TABLE mentor_applications ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';`);
    
    // Add status to sessions (defaults to pending)
    await client.query(`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';`);

    // We also need to ensure existing users have a status so they don't get blocked
    await client.query(`UPDATE users SET status = 'active' WHERE status IS NULL;`);

    console.log('Success! Database updated with status columns.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
    rl.close();
  }
});