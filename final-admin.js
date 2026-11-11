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
    
    const adminEmail = 'maxwellmbamina5@gmail.com'; 
    const adminPassword = 'User@123';
    const adminName = 'System Admin';
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(adminPassword, salt);

    // Check if user exists first
    const checkUser = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    
    if (checkUser.rows.length > 0) {
        // Update existing user
        await client.query(
            'UPDATE users SET password = $1, role = $2, status = $3 WHERE email = $4',
            [hash, 'admin', 'active', adminEmail]
        );
        console.log(`✅ Password reset successfully for existing user: ${adminEmail}`);
    } else {
        // Insert new user (using 'name', 'phone', and 'password')
        await client.query(
            `INSERT INTO users (name, email, phone, password, role, status) 
             VALUES ($1, $2, $3, $4, 'admin', 'active')`,
            [adminName, adminEmail, '0960408550', hash]
        );
        console.log(`✅ New admin account created: ${adminEmail}`);
    }

    console.log(`🔑 Password is: ${adminPassword}`);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
    rl.close();
  }
});