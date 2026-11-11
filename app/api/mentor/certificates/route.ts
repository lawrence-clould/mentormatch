import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    
    // Find the specific mentor dynamically
    const userRes: any = await pool.query("SELECT id FROM users WHERE role = 'mentor' LIMIT 1");
    const mentorId = userRes.rows[0].id;

    // 1. Get issued certificates
    const certsRes: any = await pool.query(`
      SELECT c.*, s.semester_name
      FROM certificates c
      JOIN semesters s ON c.semester_id = s.id
      WHERE c.mentor_id = $1
      ORDER BY c.issue_date DESC
    `, [mentorId]);

    // 2. Calculate current hours for eligibility
    const hoursRes: any = await pool.query(`
      SELECT COALESCE(SUM(duration_minutes) / 60.0, 0) as total_hours
      FROM sessions
      WHERE mentor_id = $1 AND status = 'completed'
    `, [mentorId]);

    const totalHours = parseFloat(hoursRes.rows[0].total_hours);
    const MIN_HOURS_REQUIRED = 10; // Standard minimum requirement

    return NextResponse.json({
      certificates: certsRes.rows,
      stats: {
        totalHours,
        minHoursRequired: MIN_HOURS_REQUIRED,
        isEligible: totalHours >= MIN_HOURS_REQUIRED
      }
    });
  } catch (error: any) {
    console.error("Certificates API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}