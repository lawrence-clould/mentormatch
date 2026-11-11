import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    const menteeId = 6; // Faith Banda

    // 1. Fetch payment history
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
    `, [menteeId]);

    const payments = res.rows;

    // 2. Calculate stats
    const totalSpent = payments
      .filter((p: any) => p.payment_status === 'captured' || p.payment_status === 'released')
      .reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0);
      
    const totalFees = payments
      .filter((p: any) => p.payment_status === 'captured' || p.payment_status === 'released')
      .reduce((sum: number, p: any) => sum + parseFloat(p.admin_fee), 0);
      
    const completedCount = payments.filter((p: any) => p.payment_status === 'released').length;
    const pendingCount = payments.filter((p: any) => p.payment_status === 'pending').length;

    return NextResponse.json({
      payments,
      stats: {
        totalSpent,
        totalFees,
        completedCount,
        pendingCount
      }
    });
  } catch (error: any) {
    console.error("Payments API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}