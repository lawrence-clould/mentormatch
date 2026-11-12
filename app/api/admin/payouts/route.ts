import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    const user = session.user;
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pool = await getPool();
    
    const res: any = await pool.query(`
      SELECT 
        s.id, 
        s.course_code, 
        s.mentor_payout, 
        s.session_date,
        u.name as mentor_name
      FROM sessions s
      JOIN users u ON s.mentor_id = u.id
      WHERE s.status = 'completed' AND s.payment_status = 'paid_to_admin'
      ORDER BY s.session_date ASC
    `);

    return NextResponse.json(res.rows);
  } catch (error: any) {
    console.error("Admin Payouts GET Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const user = session.user;
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { session_id } = body;

    if (!session_id) {
      return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
    }

    const pool = await getPool();

    await pool.query(
      "UPDATE sessions SET payment_status = 'released_to_mentor', payout_date = NOW() WHERE id = $1",
      [session_id]
    );

    await pool.query(
      "UPDATE payments SET payment_status = 'released', payout_date = NOW() WHERE session_id = $1",
      [session_id]
    );

    return NextResponse.json({ ok: true, message: "Funds released to mentor" });
  } catch (error: any) {
    console.error("Admin Payouts POST Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}