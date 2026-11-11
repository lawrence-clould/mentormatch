import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    const res: any = await pool.query(
      "SELECT * FROM mentor_availability WHERE mentor_id = 4 ORDER BY day_of_week, start_time"
    );
    return NextResponse.json(res.rows);
  } catch (error: any) {
    console.error("GET Availability Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const pool = await getPool();
    const body = await req.json();
    const { day_of_week, start_time, end_time } = body;
    
    const formattedStart = start_time.length === 5 ? start_time + ":00" : start_time;
    const formattedEnd = end_time.length === 5 ? end_time + ":00" : end_time;

    await pool.query(
      "INSERT INTO mentor_availability (mentor_id, day_of_week, start_time, end_time, is_recurring) VALUES (4, $1, $2, $3, 1)",
      [day_of_week, formattedStart, formattedEnd]
    );
    
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("POST Availability Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const pool = await getPool();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    await pool.query("DELETE FROM mentor_availability WHERE id = $1 AND mentor_id = 4", [id]);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("DELETE Availability Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}