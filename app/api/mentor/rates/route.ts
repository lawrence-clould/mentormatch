import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    const userRes: any = await pool.query("SELECT id FROM users WHERE role = 'mentor' LIMIT 1");
    const mentorId = userRes.rows[0].id;

    const res: any = await pool.query(
      "SELECT * FROM mentor_rates WHERE mentor_id = $1 ORDER BY course_code ASC",
      [mentorId]
    );
    return NextResponse.json(res.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const pool = await getPool();
    const userRes: any = await pool.query("SELECT id FROM users WHERE role = 'mentor' LIMIT 1");
    const mentorId = userRes.rows[0].id;

    const { course_code, rate_per_hour } = await req.json();

    if (!course_code || !rate_per_hour) {
      return NextResponse.json({ error: "Course code and rate are required" }, { status: 400 });
    }

    // Check if rate exists
    const existing: any = await pool.query(
      "SELECT id FROM mentor_rates WHERE mentor_id = $1 AND course_code = $2",
      [mentorId, course_code.toUpperCase()]
    );

    if (existing.rows.length > 0) {
      // Update
      await pool.query(
        "UPDATE mentor_rates SET rate_per_hour = $1 WHERE mentor_id = $2 AND course_code = $3",
        [rate_per_hour, mentorId, course_code.toUpperCase()]
      );
    } else {
      // Insert
      await pool.query(
        "INSERT INTO mentor_rates (mentor_id, course_code, rate_per_hour) VALUES ($1, $2, $3)",
        [mentorId, course_code.toUpperCase(), rate_per_hour]
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Rates POST Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const pool = await getPool();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    await pool.query("DELETE FROM mentor_rates WHERE id = $1", [id]);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}