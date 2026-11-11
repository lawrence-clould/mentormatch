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
    
    // ⚠️ REPLACE THESE WITH YOUR REAL EMAIL AND PASSWORD ⚠️
    const adminEmail = 'maxwellmbamina5@gmail.com'; 
    const adminPassword = 'User@123';
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(adminPassword, salt);

    // 1. Delete the placeholder account we accidentally made
    await client.query(`DELETE FROM users WHERE email = 'maxwellmbamina5@gmail.com'`);

    // 2. Insert your real admin account
    await client.query(`
      INSERT INTO users (name, full_name, email, password, password_hash, role, status) 
      VALUES ('System Admin', 'System Admin', $1, $2, $2, 'admin', 'active')
      ON CONFLICT (email) DO UPDATE SET password = $2, password_hash = $2, status = 'active';
    `, [adminEmail, hash]);

    console.log(`✅ Success! Admin account ready for: ${adminEmail}`);
    console.log(`🔑 Password is: ${adminPassword}`);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
    rl.close();
  }
});