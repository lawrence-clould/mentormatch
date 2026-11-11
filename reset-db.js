const { Client } = require('pg');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Paste your External Database URL here: ', async (url) => {
  const client = new Client({ connectionString: url.trim(), ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    console.log('Connected! Wiping old tables and loading official schema...');
    
    // 1. Drop everything in the public schema to start fresh
    await client.query(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);

    // 2. Read the official schema.sql file you provided
    const schemaSql = fs.readFileSync('backend/database/schema.sql', 'utf8');

    // 3. Execute the entire schema at once
    await client.query(schemaSql);

    // 4. Create your admin user
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('User@123', salt);
    
    await client.query(`
      INSERT INTO users (name, email, phone, password, role, status) 
      VALUES ('System Admin', 'maxwellmbamina5@gmail.com', '0960408550', $1, 'admin', 'active');
    `, [hash]);

    console.log('✅ Success! Official schema loaded and admin user created.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
    rl.close();
  }
});