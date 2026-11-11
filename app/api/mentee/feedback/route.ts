import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    // Find the specific mentee dynamically
    const userRes: any = await pool.query("SELECT id FROM users WHERE role = 'mentee' LIMIT 1");
    const menteeId = userRes.rows[0].id;

    // Fetch feedback given by this mentee
    const res: any = await pool.query(`
      SELECT 
        f.id, f.rating, f.comments, f.submitted_at,
        m.name as mentor_name,
        s.course_code, s.session_date
      FROM feedback f
      JOIN users m ON f.mentor_id = m.id
      JOIN sessions s ON f.session_id = s.id
      WHERE f.mentee_id = $1
      ORDER BY f.submitted_at DESC
    `, [menteeId]);

    return NextResponse.json(res.rows);
  } catch (error: any) {
    console.error("Feedback API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}