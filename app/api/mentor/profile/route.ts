import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    const res: any = await pool.query("SELECT id, name, email, phone, programme, year_of_study FROM users WHERE id = 1");
    return NextResponse.json(res.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const pool = await getPool();
    const { name, phone, programme, year_of_study } = await req.json();
    await pool.query(
      "UPDATE users SET name = $1, phone = $2, programme = $3, year_of_study = $4 WHERE id = 1",
      [name, phone, programme, year_of_study]
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}