import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getSessionUser } from "@/lib/getSessionUser";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json([]); // Return empty if not logged in
    }

    const pool = await getPool();
    
    // Fetch sessions specifically for the logged-in user
    const res: any = await pool.query(`
      SELECT 
        s.*, 
        u.name as mentor_name, 
        u.email as mentor_email
      FROM sessions s
      JOIN users u ON s.mentor_id = u.id
      WHERE s.mentee_id = $1
      ORDER BY s.session_date DESC
    `, [user.id]);

    return NextResponse.json(res.rows);
  } catch (error: any) {
    console.error("Sessions API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}