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
        r.course_code,
        COALESCE(NULLIF(c.course_name, ''), NULLIF(ma.course_name, ''), r.course_code) as course_name,
        r.rate_per_hour,
        ma.grade,
        (SELECT AVG(rating) FROM feedback WHERE mentor_id = u.id) as avg_rating,
        (SELECT COUNT(*) FROM feedback WHERE mentor_id = u.id) as total_reviews,
        (SELECT COUNT(*) FROM sessions WHERE mentor_id = u.id AND status = 'completed') as completed_sessions
      FROM users u
      JOIN mentor_rates r ON r.mentor_id = u.id
      JOIN mentor_applications ma ON ma.mentor_id = u.id AND ma.course_code = r.course_code
      LEFT JOIN courses c ON c.course_code = r.course_code
      WHERE u.role = 'mentor'
        AND u.status = 'active'
        AND ma.status = 'approved'
      ORDER BY avg_rating DESC NULLS LAST, completed_sessions DESC
    `);

    return NextResponse.json(res.rows);
  } catch (error) {
    console.error("Failed to fetch mentors:", error);
    return NextResponse.json({ error: "Failed to fetch mentors" }, { status: 500 });
  }
}