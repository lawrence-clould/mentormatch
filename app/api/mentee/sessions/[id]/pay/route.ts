import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getSessionUser } from "@/lib/getSessionUser";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const pool = await getPool();

    const sessionRes: any = await pool.query("SELECT * FROM sessions WHERE id = $1 AND mentee_id = $2", [id, user.id]);
    if (sessionRes.rows.length === 0) {
      return NextResponse.json({ error: "Session not found or unauthorized" }, { status: 404 });
    }
    const session = sessionRes.rows[0];

    await pool.query(
      "UPDATE sessions SET payment_status = 'paid_to_admin', transaction_id = 'TXN-' || floor(random() * 1000000) WHERE id = $1",
      [id]
    );

    await pool.query(`
      INSERT INTO payments 
      (session_id, mentee_id, mentor_id, amount, admin_fee, mentor_payout, payment_status, transaction_reference)
      VALUES ($1, $2, $3, $4, $5, $6, 'captured', 'TXN-' || floor(random() * 1000000))
    `, [id, user.id, session.mentor_id, session.total_amount, session.admin_fee, session.mentor_payout]);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}