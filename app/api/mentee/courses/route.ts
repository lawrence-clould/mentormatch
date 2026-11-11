import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    const menteeId = 1;
    const res: any = await pool.query(`
      SELECT me.*,
        (SELECT COUNT(*) FROM sessions s WHERE s.mentee_id = me.mentee_id AND s.course_code = me.course_code AND s.status = 'completed') as sessions_completed,
        (SELECT COUNT(DISTINCT u.id) FROM users u
          JOIN mentor_rates r ON r.mentor_id = u.id
          JOIN mentor_applications ma ON ma.mentor_id = u.id AND ma.course_code = r.course_code
          WHERE u.role = 'mentor' AND u.status = 'active' AND ma.status = 'approved' AND r.course_code = me.course_code
        ) as available_mentors
      FROM mentee_enrollments me
      WHERE me.mentee_id = $1 AND me.status != 'rejected'
      ORDER BY me.created_at DESC
    `, [menteeId]);
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error("Courses error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}