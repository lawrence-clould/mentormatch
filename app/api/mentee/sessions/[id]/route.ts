import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pool = await getPool();

  const sess: any = await pool.query(`
    SELECT s.*, u.name as mentor_name, u.email as mentor_email
    FROM sessions s
    JOIN users u ON s.mentor_id = u.id
    WHERE s.id = $1
  `, [id]);

  if (sess.rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const fb: any = await pool.query("SELECT * FROM feedback WHERE session_id = $1", [id]);

  return NextResponse.json({ session: sess.rows[0], feedback: fb.rows[0] || null });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pool = await getPool();
  await pool.query("UPDATE sessions SET status = 'cancelled' WHERE id = $1", [id]);
  return NextResponse.json({ ok: true });
}