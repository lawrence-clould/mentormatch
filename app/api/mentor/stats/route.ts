import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    const mentorId = 4; // Dadray's actual ID

    const total: any = await pool.query("SELECT COUNT(*) FROM sessions WHERE mentor_id = $1", [mentorId]);
    const completed: any = await pool.query("SELECT COUNT(*) FROM sessions WHERE mentor_id = $1 AND status = 'completed'", [mentorId]);
    const pending: any = await pool.query("SELECT COUNT(*) FROM sessions WHERE mentor_id = $1 AND status IN ('pending','confirmed')", [mentorId]);
    const earnings: any = await pool.query("SELECT COALESCE(SUM(mentor_payout),0) as total FROM sessions WHERE mentor_id = $1 AND payment_status = 'released_to_mentor'", [mentorId]);
    const hours: any = await pool.query("SELECT COALESCE(SUM(duration_minutes),0)/60.0 as total FROM sessions WHERE mentor_id = $1 AND status = 'completed'", [mentorId]);
    const rates: any = await pool.query("SELECT COUNT(*) FROM mentor_rates WHERE mentor_id = $1", [mentorId]);
    const requests: any = await pool.query("SELECT COUNT(*) FROM sessions WHERE mentor_id = $1 AND status = 'pending' AND payment_status = 'paid_to_admin'", [mentorId]);
    const hasCert: any = await pool.query("SELECT COUNT(*) FROM certificates WHERE mentor_id = $1", [mentorId]);

    return NextResponse.json({
      total: parseInt(total.rows[0].count),
      completed: parseInt(completed.rows[0].count),
      pending: parseInt(pending.rows[0].count),
      earnings: parseFloat(earnings.rows[0].total || 0),
      hours: parseFloat(hours.rows[0].total || 0),
      has_rates: parseInt(rates.rows[0].count) > 0,
      requests: parseInt(requests.rows[0].count),
      has_certificate: parseInt(hasCert.rows[0].count) > 0,
    });
  } catch (error) {
    console.error("Mentor stats error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}