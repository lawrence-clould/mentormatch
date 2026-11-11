import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    
    // 1. Dynamically find the Mentor ID
    const mentorRes: any = await pool.query("SELECT id FROM users WHERE role = 'mentor' LIMIT 1");
    if (mentorRes.rows.length === 0) {
      return NextResponse.json({ error: "No mentor found" }, { status: 404 });
    }
    const mentorId = mentorRes.rows[0].id;

    // 2. Get Total & Pending Earnings
    const totalsRes: any = await pool.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN payment_status = 'released_to_mentor' THEN mentor_payout ELSE 0 END), 0) as total_earned,
        COALESCE(SUM(CASE WHEN payment_status = 'paid_to_admin' THEN mentor_payout ELSE 0 END), 0) as pending_earnings,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN duration_minutes ELSE 0 END) / 60.0, 0) as total_hours
      FROM sessions
      WHERE mentor_id = $1
    `, [mentorId]);

    // 3. Get Earnings by Course
    const courseRes: any = await pool.query(`
      SELECT course_code, SUM(mentor_payout) as total, COUNT(*) as sessions
      FROM sessions
      WHERE mentor_id = $1 AND payment_status = 'released_to_mentor'
      GROUP BY course_code
      ORDER BY total DESC
    `, [mentorId]);

    // 4. Get Recent Payouts
    const payoutsRes: any = await pool.query(`
      SELECT s.id, s.session_date, s.course_code, s.mentor_payout, u.name as mentee_name
      FROM sessions s
      JOIN users u ON s.mentee_id = u.id
      WHERE s.mentor_id = $1 AND s.payment_status = 'released_to_mentor'
      ORDER BY s.session_date DESC
      LIMIT 5
    `, [mentorId]);

    const totals = totalsRes.rows[0];
    const avgRate = totals.total_hours > 0 ? (totals.total_earned / totals.total_hours) : 0;

    return NextResponse.json({
      stats: {
        totalEarned: parseFloat(totals.total_earned),
        pendingEarnings: parseFloat(totals.pending_earnings),
        totalHours: parseFloat(totals.total_hours),
        avgRate: avgRate
      },
      earningsByCourse: courseRes.rows,
      recentPayouts: payoutsRes.rows
    });
  } catch (error: any) {
    console.error("Earnings API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}s