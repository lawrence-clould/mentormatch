import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    
    // 1. Dynamically find the Mentee ID (Faith Banda)
    const menteeRes: any = await pool.query("SELECT id FROM users WHERE role = 'mentee' LIMIT 1");
    if (menteeRes.rows.length === 0) {
      return NextResponse.json([]);
    }
    const menteeId = menteeRes.rows[0].id;

    // 2. Fetch sessions for this exact mentee
    const res: any = await pool.query(`
      SELECT 
        s.*, 
        u.name as mentor_name, 
        u.email as mentor_email
      FROM sessions s
      JOIN users u ON s.mentor_id = u.id
      WHERE s.mentee_id = $1
      ORDER BY s.session_date DESC
    `, [menteeId]);

    return NextResponse.json(res.rows);
  } catch (error: any) {
    console.error("Sessions API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}