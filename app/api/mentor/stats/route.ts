import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    const user = session.user;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const pool = await getPool();
    const mentorId = Number(user.id);

    const total: any = await pool.query("SELECT COUNT(*) FROM sessions WHERE mentor_id = $1", [mentorId]);
    const completed: any = await pool.query("SELECT COUNT(*) FROM sessions WHERE mentor_id = $1 AND status = 'completed'", [mentorId]);
    const pending: any = await pool.query("SELECT COUNT(*) FROM sessions WHERE mentor_id = $1 AND status IN ('pending','confirmed')", [mentorId]);
    const earnings: any = await pool.query("SELECT COALESCE(SUM(mentor_payout),0) as total FROM sessions WHERE mentor_id = $1 AND payment_status = 'released_to_mentor'", [mentorId]);
    const hours: any = await pool.query("SELECT COALESCE(SUM(duration_minutes),0)/60.0 as total FROM sessions WHERE mentor_id = $1 AND status = 'completed'", [mentorId]);
    const rates: any = await pool.query("SELECT COUNT(*) FROM mentor_rates WHERE mentor_id = $1", [mentorId]);
    
    return NextResponse.json({
      total: parseInt(total.rows[0].count),
      completed: parseInt(completed.rows[0].count),
      pending: parseInt(pending.rows[0].count),
      earnings: parseFloat(earnings.rows[0].total || 0),
      hours: parseFloat(hours.rows[0].total || 0),
      has_rates: parseInt(rates.rows[0].count) > 0,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}