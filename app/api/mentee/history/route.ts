import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    const menteeId = 6; // Faith Banda

    // 1. Get all sessions (completed and cancelled)
    const sessionsRes: any = await pool.query(`
      SELECT s.*, u.name as mentor_name, u.email as mentor_email
      FROM sessions s
      JOIN users u ON s.mentor_id = u.id
      WHERE s.mentee_id = $1 AND s.status IN ('completed', 'cancelled')
      ORDER BY s.session_date DESC
    `, [menteeId]);

    // 2. Get stats for the top cards
    const statsRes: any = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COALESCE(SUM(CASE WHEN payment_status = 'paid_to_admin' THEN total_amount ELSE 0 END), 0) as total_spent,
        COUNT(DISTINCT course_code) as total_courses
      FROM sessions
      WHERE mentee_id = $1 AND status IN ('completed', 'cancelled')
    `, [menteeId]);

    return NextResponse.json({
      sessions: sessionsRes.rows,
      stats: {
        total: parseInt(statsRes.rows[0].total),
        completed: parseInt(statsRes.rows[0].completed),
        totalSpent: parseFloat(statsRes.rows[0].total_spent),
        courses: parseInt(statsRes.rows[0].total_courses),
      }
    });
  } catch (error: any) {
    console.error("History API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}