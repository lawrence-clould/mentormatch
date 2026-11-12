import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    
    // Find sessions starting in the next 10 minutes
    const res: any = await pool.query(`
      SELECT s.id, s.session_date, u.name as mentee_name, m.name as mentor_name
      FROM sessions s
      JOIN users u ON s.mentee_id = u.id
      JOIN users m ON s.mentor_id = m.id
      WHERE s.status = 'confirmed'
      AND s.session_date BETWEEN NOW() AND NOW() + INTERVAL '10 minutes'
    `);

    if (res.rows.length > 0) {
      res.rows.forEach((session: any) => {
        console.log(`🔔 NOTIFICATION: Session #${session.id} starts in 10 minutes!`);
        console.log(`   Mentor: ${session.mentor_name} | Mentee: ${session.mentee_name}`);
        console.log(`   Time: ${session.session_date}`);
        // In a real app, we would call an Email API here.
      });
    }

    return NextResponse.json({ 
      message: "Notification check complete", 
      upcomingSessions: res.rows.length 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}