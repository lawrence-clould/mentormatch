import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const pool = await getPool();
    const mentorId = 4; // Dadray Mathotho

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