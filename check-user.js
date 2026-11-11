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
    
    // Change this to the email you are trying to log in with
    const email = 'YOUR_ADMIN_EMAIL@example.com'; 
    
    const res = await client.query(`SELECT id, email, password, password_hash, status FROM users WHERE email = $1`, [email]);
    
    if (res.rows.length === 0) {
      console.log('User not found in database!');
    } else {
      console.log('User found in database:');
      console.log('Email:', res.rows[0].email);
      console.log('Status:', res.rows[0].status);
      console.log('Password Column:', res.rows[0].password ? 'Has a hash' : 'EMPTY');
      console.log('Password_hash Column:', res.rows[0].password_hash ? 'Has a hash' : 'EMPTY');
    }

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
    rl.close();
  }
});