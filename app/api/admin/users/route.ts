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
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// NEW: DELETE method to remove a user
export async function DELETE(req: Request) {
  try {
    const pool = await getPool();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    // 1. Delete related records first (to avoid foreign key errors)
    await pool.query("DELETE FROM mentor_rates WHERE mentor_id = $1", [id]);
    await pool.query("DELETE FROM mentor_applications WHERE mentor_id = $1", [id]);
    await pool.query("DELETE FROM mentee_enrollments WHERE mentee_id = $1", [id]);
    await pool.query("DELETE FROM feedback WHERE mentor_id = $1 OR mentee_id = $1", [id]);
    
    // 2. Delete the user
    await pool.query("DELETE FROM users WHERE id = $1", [id]);

    return NextResponse.json({ ok: true, message: "User deleted" });
  } catch (error: any) {
    console.error("Failed to delete user:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}