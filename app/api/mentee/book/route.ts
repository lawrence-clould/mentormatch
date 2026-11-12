import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const user = session.user;
    
    // DEBUG: Log the user ID
    console.log("BOOKING API - Logged in user:", user);

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const pool = await getPool();
    const body = await req.json();
    const { mentor_id, course_code, session_date, session_time, duration_minutes } = body;
    
    const semRes: any = await pool.query("SELECT id FROM semesters LIMIT 1");
    const semesterId = semRes.rows.length > 0 ? semRes.rows[0].id : 1;

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

    // Insert and return the inserted row to verify
    const insertRes: any = await pool.query(`
      INSERT INTO sessions 
      (mentee_id, mentor_id, semester_id, course_code, session_date, duration_minutes, mentor_rate, total_amount, admin_fee, mentor_payout, status, payment_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending', 'pending') RETURNING *
    `, [user.id, mentor_id, semesterId, course_code, dateTime, duration_minutes, rate, totalAmount, adminFee, mentorPayout]);

    console.log("BOOKING API - Inserted session:", insertRes.rows[0]);

    return NextResponse.json({ ok: true, session_id: insertRes.rows[0].id });
  } catch (error: any) {
    console.error("BOOKING API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}