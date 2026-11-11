import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    
    const usersRes: any = await pool.query("SELECT COUNT(*) FROM users WHERE role != 'admin'");
    const mentorsRes: any = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'mentor'");
    const menteesRes: any = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'mentee'");
    const sessionsRes: any = await pool.query("SELECT COUNT(*) FROM sessions");
    const completedRes: any = await pool.query("SELECT COUNT(*) FROM sessions WHERE status = 'completed'");
    const revenueRes: any = await pool.query("SELECT COALESCE(SUM(total_amount), 0) as total FROM sessions WHERE payment_status = 'released_to_mentor'");

    return NextResponse.json({
      totalUsers: parseInt(usersRes.rows[0].count),
      totalMentors: parseInt(mentorsRes.rows[0].count),
      totalMentees: parseInt(menteesRes.rows[0].count),
      totalSessions: parseInt(sessionsRes.rows[0].count),
      completedSessions: parseInt(completedRes.rows[0].count),
      totalRevenue: parseFloat(revenueRes.rows[0].total || 0)
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}