import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    
    // 1. Dynamically find the Mentee ID
    const menteeRes: any = await pool.query("SELECT id FROM users WHERE role = 'mentee' LIMIT 1");
    if (menteeRes.rows.length === 0) {
      return NextResponse.json({ payments: [], stats: { totalSpent: 0, totalFees: 0, completedCount: 0, pendingCount: 0 } });
    }
    const menteeId = menteeRes.rows[0].id;

    // 2. Fetch payment history
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

    // 3. Calculate stats
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