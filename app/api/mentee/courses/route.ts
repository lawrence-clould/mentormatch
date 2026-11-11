import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    const userRes: any = await pool.query("SELECT id FROM users WHERE role = 'mentee' LIMIT 1");
    const menteeId = userRes.rows[0].id;

    const res: any = await pool.query(`
      SELECT * FROM mentee_enrollments 
      WHERE mentee_id = $1 
      ORDER BY created_at DESC
    `, [menteeId]);

    return NextResponse.json(res.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const pool = await getPool();
    const userRes: any = await pool.query("SELECT id FROM users WHERE role = 'mentee' LIMIT 1");
    const menteeId = userRes.rows[0].id;
    
    const body = await req.json();
    const { course_code, course_name } = body;

    if (!course_code) {
      return NextResponse.json({ error: "Course code is required" }, { status: 400 });
    }

    await pool.query(`
      INSERT INTO mentee_enrollments (mentee_id, course_code, course_name, status, semester_id)
      VALUES ($1, $2, $3, 'active', 1)
    `, [menteeId, course_code, course_name || course_code]);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const pool = await getPool();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    await pool.query("DELETE FROM mentee_enrollments WHERE id = $1", [id]);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}