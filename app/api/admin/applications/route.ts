import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    
    const res: any = await pool.query(`
      SELECT 
        u.id, u.name, u.email, u.phone, u.programme, u.year_of_study, u.role, u.status, u.created_at,
        ma.id as application_id, ma.course_code, ma.grade, ma.status as app_status
      FROM users u
      LEFT JOIN mentor_applications ma ON u.id = ma.mentor_id
      WHERE u.role IN ('mentor', 'mentee')
      ORDER BY u.created_at DESC
    `);

    const users = res.rows;
    const activeUsers = users.filter((u: any) => u.status === 'active');
    const pendingApps = users.filter((u: any) => u.status === 'pending');
    const approvedMentors = users.filter((u: any) => u.role === 'mentor' && u.status === 'active');
    
    return NextResponse.json({
      users,
      stats: {
        activeUsers: activeUsers.length,
        activeMentors: approvedMentors.length,
        activeMentees: activeUsers.filter((u: any) => u.role === 'mentee').length,
        pendingApps: pendingApps.length,
        totalApproved: activeUsers.length, 
      }
    });
  } catch (error: any) {
    console.error("Admin Apps Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}