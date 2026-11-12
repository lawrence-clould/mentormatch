import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    const user = session.user;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = Number(user.id); // Convert string '8' to number 8
    const { id } = await params;
    const pool = await getPool();

    const sessionRes: any = await pool.query(
      "SELECT * FROM sessions WHERE id = $1 AND mentee_id = $2",
      [id, userId]
    );
    
    if (sessionRes.rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    
    const sessionData = sessionRes.rows[0];

    await pool.query(
      "UPDATE sessions SET payment_status = 'paid_to_admin' WHERE id = $1",
      [id]
    );
    
    await pool.query(`
      INSERT INTO payments (session_id, mentee_id, mentor_id, amount, admin_fee, mentor_payout, payment_status)
      VALUES ($1, $2, $3, $4, $5, $6, 'captured')
    `, [id, userId, sessionData.mentor_id, sessionData.total_amount, sessionData.admin_fee, sessionData.mentor_payout]);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}