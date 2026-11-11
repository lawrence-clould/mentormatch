import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    const res: any = await pool.query(
      "SELECT * FROM mentor_availability WHERE mentor_id = 1 ORDER BY day_of_week, start_time"
    );
    return NextResponse.json(res.rows);
  } catch (error: any) {
    console.error("GET Availability Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// ... rest of the file