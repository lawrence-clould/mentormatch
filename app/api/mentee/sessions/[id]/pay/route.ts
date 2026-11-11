import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pool = await getPool();

    // 1. Get the session details to copy to payments table
    const sessionRes: any = await pool.query("SELECT * FROM sessions WHERE id = $1", [id]);
    if (sessionRes.rows.length === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    const session = sessionRes.rows[0];

    // 2. Update the session to paid
    await pool.query(
      "UPDATE sessions SET payment_status = 'paid_to_admin', transaction_id = 'TXN-' || floor(random() * 1000000) WHERE id = $1",
      [id]
    );

    // 3. Insert into payments table
    await pool.query(`
      INSERT INTO payments 
      (session_id, mentee_id, mentor_id, amount, admin_fee, mentor_payout, payment_status, transaction_reference)
      VALUES ($1, $2, $3, $4, $5, $6, 'captured', 'TXN-' || floor(random() * 1000000))
    `, [id, session.mentee_id, session.mentor_id, session.total_amount, session.admin_fee, session.mentor_payout]);

    return NextResponse.json({ ok: true, message: "Payment successful" });
  } catch (error: any) {
    console.error("Payment Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}