const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Paste your External Database URL here: ', async (url) => {
  const client = new Client({ connectionString: url.trim(), ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    
    // CHANGE THESE TO YOUR ACTUAL ADMIN EMAIL AND PASSWORD
    const adminEmail = 'YOUR_ADMIN_EMAIL@example.com'; 
    const adminPassword = 'YOUR_ADMIN_PASSWORD';
    const adminName = 'Admin User';

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(adminPassword, salt);

    await client.query(`
      INSERT INTO users (name, full_name, email, password, password_hash, role) 
      VALUES ($1, $2, $3, $4, $5, 'admin')
      ON CONFLICT (email) DO UPDATE SET password = $4, role = 'admin';
    `, [adminName, adminName, adminEmail, hash, hash]);

    console.log('Success! Admin account created.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
    rl.close();
  }
});