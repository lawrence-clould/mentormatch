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
    
    // REPLACE THESE TWO LINES WITH YOUR ACTUAL ADMIN EMAIL AND PASSWORD
    const adminEmail = 'maxwellmbamina@gmail.com'; 
    const adminPassword = 'User@123';
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(adminPassword, salt);

    const res = await client.query(`
      UPDATE users 
      SET password = $1, password_hash = $1, status = 'active', role = 'admin'
      WHERE email = $2
      RETURNING id, email, role;
    `, [hash, adminEmail]);

    if (res.rowCount === 0) {
        console.log('❌ User not found! Inserting a new user instead...');
        await client.query(`
          INSERT INTO users (name, full_name, email, password, password_hash, role, status) 
          VALUES ('Admin', 'Admin', $2, $1, $1, 'admin', 'active')
        `, [hash, adminEmail]);
        console.log('✅ Admin user created!');
    } else {
        console.log('✅ Password reset for user:', res.rows[0].email);
    }

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
    rl.close();
  }
});