import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const user = session.user;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = parseInt(user.id as any, 10);
    const body = await req.json();
    const { session_id, rating, comments } = body;

    const pool = await getPool();

    // Get mentor_id from the session
    const sessionRes: any = await pool.query("SELECT mentor_id FROM sessions WHERE id = $1 AND mentee_id = $2", [session_id, userId]);
    if (sessionRes.rows.length === 0) return NextResponse.json({ error: "Session not found" }, { status: 404 });

    const mentorId = sessionRes.rows[0].mentor_id;

    await pool.query(`
      INSERT INTO feedback (session_id, mentee_id, mentor_id, rating, comments)
      VALUES ($1, $2, $3, $4, $5)
    `, [session_id, userId, mentorId, rating, comments]);

    return NextResponse.json({ ok: true, message: "Feedback submitted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}