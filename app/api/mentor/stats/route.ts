import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getSessionUser } from "@/lib/getSessionUser";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const pool = await getPool();
    
    const total: any = await pool.query("SELECT COUNT(*) FROM sessions WHERE mentor_id = $1", [user.id]);
    const completed: any = await pool.query("SELECT COUNT(*) FROM sessions WHERE mentor_id = $1 AND status = 'completed'", [user.id]);
    const pending: any = await pool.query("SELECT COUNT(*) FROM sessions WHERE mentor_id = $1 AND status IN ('pending','confirmed')", [user.id]);
    const earnings: any = await pool.query("SELECT COALESCE(SUM(mentor_payout),0) as total FROM sessions WHERE mentor_id = $1 AND payment_status = 'released_to_mentor'", [user.id]);
    const hours: any = await pool.query("SELECT COALESCE(SUM(duration_minutes),0)/60.0 as total FROM sessions WHERE mentor_id = $1 AND status = 'completed'", [user.id]);
    const rates: any = await pool.query("SELECT COUNT(*) FROM mentor_rates WHERE mentor_id = $1", [user.id]);
    
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