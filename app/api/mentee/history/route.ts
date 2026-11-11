import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    const menteeId = 1;

    const sessionsRes: any = await pool.query(`
      SELECT s.*, u.name as mentor_name
      FROM sessions s
      JOIN users u ON s.mentor_id = u.id
      WHERE s.mentee_id = $1
      ORDER BY s.session_date DESC
    `, [menteeId]);

    const total: any = await pool.query("SELECT COUNT(*) FROM sessions WHERE mentee_id = $1", [menteeId]);
    const completed: any = await pool.query("SELECT COUNT(*) FROM sessions WHERE mentee_id = $1 AND status = 'completed'", [menteeId]);
    const spent: any = await pool.query("SELECT COALESCE(SUM(total_amount), 0) as total FROM sessions WHERE mentee_id = $1 AND payment_status = 'paid_to_admin'", [menteeId]);
    const coursesRes: any = await pool.query("SELECT COUNT(DISTINCT course_code) FROM sessions WHERE mentee_id = $1", [menteeId]);

    return NextResponse.json({
      sessions: sessionsRes.rows,
      stats: {
        total: parseInt(total.rows[0].count),
        completed: parseInt(completed.rows[0].count),
        spent: parseFloat(spent.rows[0].total || 0),
        courses: parseInt(coursesRes.rows[0].count),
      },
    });
  } catch (error) {
    console.error("History error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}