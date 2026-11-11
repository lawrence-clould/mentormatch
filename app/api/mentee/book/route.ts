import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const pool = await getPool();
    const body = await req.json();
    const { mentor_id, course_code, session_date, session_time, duration_minutes } = body;
    
    // Hardcoded mentee ID (Faith) and semester ID
    const menteeId = 6;
    const semesterId = 1; 

    // 1. Get the mentor's rate
    const rateRes: any = await pool.query(
      "SELECT rate_per_hour FROM mentor_rates WHERE mentor_id = $1 AND course_code = $2",
      [mentor_id, course_code]
    );

    if (rateRes.rows.length === 0) {
      return NextResponse.json({ error: "Rate not found for this course" }, { status: 400 });
    }

    const rate = parseFloat(rateRes.rows[0].rate_per_hour);
    
    // 2. Calculate fees
    const totalAmount = (rate * duration_minutes) / 60;
    const adminFee = totalAmount * 0.05;
    const mentorPayout = totalAmount - adminFee;

    // 3. Format the date/time properly for Postgres
    const dateTime = `${session_date}T${session_time}:00`;

    // 4. Insert the session
    const insertRes: any = await pool.query(`
      INSERT INTO sessions 
      (mentee_id, mentor_id, semester_id, course_code, session_date, duration_minutes, mentor_rate, total_amount, admin_fee, mentor_payout, status, payment_status)
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending', 'pending')
      RETURNING id
    `, [menteeId, mentor_id, semesterId, course_code, dateTime, duration_minutes, rate, totalAmount, adminFee, mentorPayout]);

    const sessionId = insertRes.rows[0].id;

    return NextResponse.json({ 
      ok: true, 
      session_id: sessionId,
      message: "Session booked successfully" 
    });

  } catch (error: any) {
    console.error("Booking Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}