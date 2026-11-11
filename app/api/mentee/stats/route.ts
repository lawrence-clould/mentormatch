import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    
    // For now, we'll use a placeholder user ID until you set up session auth for mentees
    // You can replace this with the actual logged-in mentee ID later
    const menteeId = 1; 

    const totalRes: any = await pool.query("SELECT COUNT(*) FROM sessions WHERE mentee_id = $1", [menteeId]);
    const completedRes: any = await pool.query("SELECT COUNT(*) FROM sessions WHERE mentee_id = $1 AND status = 'completed'", [menteeId]);
    const upcomingRes: any = await pool.query("SELECT COUNT(*) FROM sessions WHERE mentee_id = $1 AND status IN ('pending', 'confirmed') AND session_date > NOW()", [menteeId]);
    const spentRes: any = await pool.query("SELECT COALESCE(SUM(total_amount), 0) as total FROM sessions WHERE mentee_id = $1 AND payment_status = 'paid_to_admin'", [menteeId]);
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
      },
      recentSessions: recentRes.rows,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to fetch mentee stats" }, { status: 500 });
  }
}