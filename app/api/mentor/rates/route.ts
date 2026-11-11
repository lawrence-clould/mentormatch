import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    const res: any = await pool.query("SELECT * FROM mentor_rates WHERE mentor_id = 1");
    return NextResponse.json(res.rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const pool = await getPool();
    const { course_code, rate_per_hour } = await req.json();
    
    const existing: any = await pool.query("SELECT id FROM mentor_rates WHERE mentor_id = 1 AND course_code = $1", [course_code]);
    
    if (existing.rows.length > 0) {
      await pool.query("UPDATE mentor_rates SET rate_per_hour = $1 WHERE mentor_id = 1 AND course_code = $2", [rate_per_hour, course_code]);
    } else {
      await pool.query("INSERT INTO mentor_rates (mentor_id, course_code, rate_per_hour) VALUES (1, $1, $2)", [course_code, rate_per_hour]);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const pool = await getPool();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    await pool.query("DELETE FROM mentor_rates WHERE id = $1 AND mentor_id = 1", [id]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}