import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    
    // Find the actual Mentee ID dynamically
    const userRes: any = await pool.query("SELECT id FROM users WHERE role = 'mentee' LIMIT 1");
    
    if (userRes.rows.length === 0) {
      return NextResponse.json({ error: "No mentee found" }, { status: 404 });
    }
    
    const menteeId = userRes.rows[0].id;

    const totalRes: any = await pool.query("SELECT COUNT(*) FROM sessions WHERE mentee_id = $1", [menteeId]);
    const completedRes: any = await pool.query("SELECT COUNT(*) FROM sessions WHERE mentee_id = $1 AND status = 'completed'", [menteeId]);
    const upcomingRes: any = await pool.query("SELECT COUNT(*) FROM sessions WHERE mentee_id = $1 AND status IN ('pending', 'confirmed') AND session_date > NOW()", [menteeId]);
    const spentRes: any = await pool.query("SELECT COALESCE(SUM(total_amount), 0) as total FROM sessions WHERE mentee_id = $1 AND payment_status = 'paid_to_admin'", [menteeId]);
    
    const feedbackRes: any = await pool.query("SELECT COUNT(*) FROM feedback WHERE mentee_id = $1", [menteeId]);

    const recentRes: any = await pool.query(`
      SELECT s.id, s.course_code, s.session_date, s.status, s.payment_status, u.name as mentor_name
      FROM sessions s
      JOIN users u ON s.mentor_id = u.id
      WHERE s.mentee_id = $1
      ORDER BY s.created_at DESC LIMIT 5
    `, [menteeId]);

    return NextResponse.json({
      stats: {
        totalSessions: parseInt(totalRes.rows[0].count),
        completedSessions: parseInt(completedRes.rows[0].count),
        upcomingSessions: parseInt(upcomingRes.rows[0].count),
        totalSpent: parseFloat(spentRes.rows[0].total || 0),
        feedbackGiven: parseInt(feedbackRes.rows[0].count),
      },
      recentSessions: recentRes.rows,
    });
  } catch (error: any) {
    console.error("Database error:", error.message);
    return NextResponse.json({ error: "Failed to fetch mentee stats" }, { status: 500 });
  }
}