import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    
    const res: any = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.programme,
        u.year_of_study,
        COALESCE(r.course_code, 'General') as course_code,
        COALESCE(NULLIF(c.course_name, ''), NULLIF(ma.course_name, ''), r.course_code, 'General Mentorship') as course_name,
        COALESCE(r.rate_per_hour, 0) as rate_per_hour,
        ma.grade,
        (SELECT COALESCE(AVG(rating), 0) FROM feedback WHERE mentor_id = u.id) as avg_rating,
        (SELECT COUNT(*) FROM feedback WHERE mentor_id = u.id) as total_reviews,
        (SELECT COUNT(*) FROM sessions WHERE mentor_id = u.id AND status = 'completed') as completed_sessions
      FROM users u
      LEFT JOIN mentor_rates r ON r.mentor_id = u.id
      LEFT JOIN mentor_applications ma ON ma.mentor_id = u.id
      LEFT JOIN courses c ON c.course_code = r.course_code
      WHERE u.role = 'mentor'
        AND u.status = 'active'
      ORDER BY avg_rating DESC NULLS LAST, completed_sessions DESC
    `);

    return NextResponse.json(res.rows);
  } catch (error: any) {
    console.error("Failed to fetch mentors:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}