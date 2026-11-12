import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    const user = session.user;
    if (!user) {
      return NextResponse.json({ payments: [], stats: { totalSpent: 0, totalFees: 0, completedCount: 0, pendingCount: 0 } });
    }

    const pool = await getPool();
    
    // CRITICAL: Force the ID to be an integer
    const userId = parseInt(user.id as any, 10);

    const res: any = await pool.query(`
      SELECT 
        p.id, p.amount, p.admin_fee, p.mentor_payout, p.payment_status, p.created_at,
        u.name as mentor_name,
        s.course_code, s.session_date
      FROM payments p
      JOIN sessions s ON p.session_id = s.id
      JOIN users u ON p.mentor_id = u.id
      WHERE p.mentee_id = $1
      ORDER BY p.created_at DESC
    `, [userId]);

    const payments = res.rows;

    const totalSpent = payments.reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0);
    const totalFees = payments.reduce((sum: number, p: any) => sum + parseFloat(p.admin_fee), 0);
    const completedCount = payments.filter((p: any) => p.payment_status === 'released').length;
    const pendingCount = payments.filter((p: any) => p.payment_status === 'pending').length;

    return NextResponse.json({
      payments,
      stats: { totalSpent, totalFees, completedCount, pendingCount }
    });
  } catch (error: any) {
    console.error("Payments API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}