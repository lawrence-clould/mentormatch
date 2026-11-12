import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    const user = session.user;
    if (!user) return NextResponse.json([]);

    const pool = await getPool();
    const mentorId = parseInt(user.id as any, 10);

    const res: any = await pool.query(`
      SELECT s.*, u.name as mentee_name, u.email as mentee_email
      FROM sessions s
      JOIN users u ON s.mentee_id = u.id
      WHERE s.mentor_id = $1
      ORDER BY s.session_date DESC
    `, [mentorId]);

    return NextResponse.json(res.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}