import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    // Find the specific mentor dynamically
    const userRes: any = await pool.query("SELECT id FROM users WHERE role = 'mentor' LIMIT 1");
    const mentorId = userRes.rows[0].id;

    // 1. Get past sessions (completed, cancelled, no_show)
    const sessionsRes: any = await pool.query(`
      SELECT s.*, u.name as mentee_name, u.email as mentee_email
      FROM sessions s
      JOIN users u ON s.mentee_id = u.id
      WHERE s.mentor_id = $1 AND s.status IN ('completed', 'cancelled', 'no_show')
      ORDER BY s.session_date DESC
    `, [mentorId]);

    // 2. Get stats for the top cards
    const statsRes: any = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COALESCE(SUM(duration_minutes) / 60.0, 0) as total_hours,
        COALESCE(SUM(CASE WHEN payment_status = 'released_to_mentor' THEN mentor_payout ELSE 0 END), 0) as total_earnings
      FROM sessions
      WHERE mentor_id = $1 AND status IN ('completed', 'cancelled', 'no_show')
    `, [mentorId]);

    const stats = statsRes.rows[0];

    return NextResponse.json({
      sessions: sessionsRes.rows,
      stats: {
        totalSessions: parseInt(stats.total),
        totalHours: parseFloat(stats.total_hours),
        totalEarnings: parseFloat(stats.total_earnings)
      }
    });
  } catch (error: any) {
    console.error("History API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}