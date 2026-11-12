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
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const pool = await getPool();
    const { id, status } = await req.json();
    await pool.query("UPDATE users SET status = $1 WHERE id = $2", [status, id]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const pool = await getPool();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    // Delete related records first
    await pool.query("DELETE FROM mentor_rates WHERE mentor_id = $1", [id]);
    await pool.query("DELETE FROM mentor_applications WHERE mentor_id = $1", [id]);
    await pool.query("DELETE FROM mentee_enrollments WHERE mentee_id = $1", [id]);
    await pool.query("DELETE FROM feedback WHERE mentor_id = $1 OR mentee_id = $1", [id]);
    
    // Delete the user
    await pool.query("DELETE FROM users WHERE id = $1", [id]);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}