import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const user = session.user;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const pool = await getPool();
    const body = await req.json();
    const { mentor_id, course_code, session_date, session_time, duration_minutes } = body;
    
    const userId = parseInt(user.id as any, 10);
    
    // Fetch the active semester ID
    const semRes: any = await pool.query("SELECT id FROM semesters ORDER BY id DESC LIMIT 1");
    if (semRes.rows.length === 0) {
      return NextResponse.json({ error: "No semester found" }, { status: 400 });
    }
    const semesterId = semRes.rows[0].id;

    // Get the mentor's rate
    const rateRes: any = await pool.query(
      "SELECT rate_per_hour FROM mentor_rates WHERE mentor_id = $1 AND course_code = $2",
      [mentor_id, course_code]
    );
    if (rateRes.rows.length === 0) return NextResponse.json({ error: "Rate not found" }, { status: 400 });

    const rate = parseFloat(rateRes.rows[0].rate_per_hour);
    const totalAmount = (rate * duration_minutes) / 60;
    const adminFee = totalAmount * 0.05;
    const mentorPayout = totalAmount - adminFee;
    const dateTime = `${session_date}T${session_time}:00`;

    // Create the session (payment_status = pending until they pay)
    const insertRes: any = await pool.query(`
      INSERT INTO sessions 
      (mentee_id, mentor_id, semester_id, course_code, session_date, duration_minutes, mentor_rate, total_amount, admin_fee, mentor_payout, status, payment_status)
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending', 'pending') RETURNING id
    `, [userId, mentor_id, semesterId, course_code, dateTime, duration_minutes, rate, totalAmount, adminFee, mentorPayout]);

    return NextResponse.json({ ok: true, session_id: insertRes.rows[0].id });
  } catch (error: any) {
    console.error("Booking Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}