import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    const user = session.user;

    // DEBUG: Log the user ID
    console.log("SESSIONS API - Logged in user:", user);

    if (!user) return NextResponse.json([]);

    const pool = await getPool();
    
    // Query using the exact user.id from the session
    const res: any = await pool.query(`
      SELECT s.*, u.name as mentor_name, u.email as mentor_email
      FROM sessions s
      JOIN users u ON s.mentor_id = u.id
      WHERE s.mentee_id = $1
      ORDER BY s.session_date DESC
    `, [user.id]);

    console.log("SESSIONS API - Found sessions:", res.rows.length);

    return NextResponse.json(res.rows);
  } catch (error: any) {
    console.error("SESSIONS API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}