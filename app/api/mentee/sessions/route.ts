import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    const menteeId = 6; // Faith Banda

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