import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    const res: any = await pool.query("SELECT * FROM mentor_availability WHERE mentor_id = 1 ORDER BY day_of_week, start_time");
    return NextResponse.json(res.rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const pool = await getPool();
    const { day_of_week, start_time, end_time } = await req.json();
    await pool.query(
      "INSERT INTO mentor_availability (mentor_id, day_of_week, start_time, end_time, is_recurring) VALUES (1, $1, $2, $3, 1)",
      [day_of_week, start_time, end_time]
    );
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
    await pool.query("DELETE FROM mentor_availability WHERE id = $1 AND mentor_id = 1", [id]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}