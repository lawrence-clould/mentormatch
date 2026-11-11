import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const pool = await getPool();
    const body = await req.json();
    const { mentor_id, course_code, session_date, session_time, duration_minutes } = body;
    
    // 1. Dynamically find the Mentee ID
    const menteeRes: any = await pool.query("SELECT id FROM users WHERE role = 'mentee' LIMIT 1");
    const menteeId = menteeRes.rows[0].id;
    
    // 2. Get the active semester ID
    const semRes: any = await pool.query("SELECT id FROM semesters LIMIT 1");
    const semesterId = semRes.rows.length > 0 ? semRes.rows[0].id : 1;

    // 3. Get the mentor's rate
    const rateRes: any = await pool.query(
      "SELECT rate_per_hour FROM mentor_rates WHERE mentor_id = $1 AND course_code = $2",
      [mentor_id, course_code]
    );

    if (rateRes.rows.length === 0) {
      return NextResponse.json({ error: "Rate not found for this course" }, { status: 400 });
    }

    const rate = parseFloat(rateRes.rows[0].rate_per_hour);
    
    // 4. Calculate fees
    const totalAmount = (rate * duration_minutes) / 60;
    const adminFee = totalAmount * 0.05;
    const mentorPayout = totalAmount - adminFee;

    // 5. Format date/time
    const dateTime = `${session_date}T${session_time}:00`;

    // 6. Insert the session
    const insertRes: any = await pool.query(`
      INSERT INTO sessions 
      (mentee_id, mentor_id, semester_id, course_code, session_date, duration_minutes, mentor_rate, total_amount, admin_fee, mentor_payout, status, payment_status)
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending', 'pending')
      RETURNING id
    `, [menteeId, mentor_id, semesterId, course_code, dateTime, duration_minutes, rate, totalAmount, adminFee, mentorPayout]);

    return NextResponse.json({ 
      ok: true, 
      session_id: insertRes.rows[0].id,
      message: "Session booked successfully" 
    });

  } catch (error: any) {
    console.error("Booking Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}