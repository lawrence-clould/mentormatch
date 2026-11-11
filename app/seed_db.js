const { Client } = require('pg');

// Your Render External Database URL
const connectionString = 'postgresql://mentormatch:vhsl54Y4rlI24TZPNl27oC4eA7Y8QI9Z@dpg-dbpoc0o8v5cc73e0p1b0-a.oregon-postgres.render.com/mentormatch_nwqz';

const client = new Client({ 
  connectionString,
  ssl: { rejectUnauthorized: false } // THIS IS REQUIRED FOR RENDER EXTERNAL CONNECTIONS
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to Render PostgreSQL...");

    // 1. Create the availability table
    await client.query(`
      CREATE TABLE IF NOT EXISTS mentor_availability (
        id SERIAL PRIMARY KEY,
        mentor_id INTEGER NOT NULL,
        day_of_week INTEGER NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        is_recurring BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Availability table created.");

    // 2. Seed the courses
    const courses = [
      ['CSC101', 'Introduction to Computer Science'],
      ['CSC102', 'Programming Fundamentals'],
      ['MAT101', 'Mathematics for Science'],
      ['MAT102', 'Calculus I'],
      ['PHY101', 'Physics I'],
      ['BIO101', 'Biology I'],
      ['CHE101', 'Chemistry I'],
      ['ENG101', 'English Composition'],
      ['ACC101', 'Principles of Accounting'],
      ['ECO101', 'Principles of Economics'],
      ['PSY101', 'Introduction to Psychology'],
      ['SOC101', 'Introduction to Sociology'],
      ['BUS101', 'Introduction to Business'],
      ['LAW101', 'Introduction to Law']
    ];

    for (let c of courses) {
      await client.query(
        'INSERT INTO courses (course_code, course_name) VALUES ($1, $2) ON CONFLICT (course_code) DO NOTHING',
        c
      );
    }
    console.log("✅ Courses seeded successfully!");

  } catch (err) {
    console.error("❌ Database Error:", err.message);
  } finally {
    await client.end();
    console.log("Done.");
  }
}

run();