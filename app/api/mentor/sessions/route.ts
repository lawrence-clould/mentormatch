import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    
    // 1. Dynamically find the Mentor ID
    const mentorRes: any = await pool.query("SELECT id FROM users WHERE role = 'mentor' LIMIT 1");
    if (mentorRes.rows.length === 0) {
      return NextResponse.json([]);
    }
    const mentorId = mentorRes.rows[0].id;

    // 2. Fetch sessions for this mentor
    const res: any = await pool.query(`
      SELECT 
        s.*, 
        u.name as mentee_name, 
        u.email as mentee_email
      FROM sessions s
      JOIN users u ON s.mentee_id = u.id
      WHERE s.mentor_id = $1
      ORDER BY s.session_date DESC
    `, [mentorId]);

    return NextResponse.json(res.rows);
  } catch (error: any) {
    console.error("Mentor Sessions API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}