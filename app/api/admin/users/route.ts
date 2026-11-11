import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    
    const res: any = await pool.query(
      "SELECT id, name, email, phone, role, status, programme, year_of_study FROM users WHERE role != 'admin' ORDER BY created_at DESC"
    );
    
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const pool = await getPool();
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    await pool.query("UPDATE users SET status = $1 WHERE id = $2", [status, id]);
    
    return NextResponse.json({ ok: true, message: `User ${id} updated to ${status}` });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}