import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pool = await getPool();
  const res: any = await pool.query(
    `SELECT s.*, u.name as mentee_name, u.email as mentee_email, u.phone as mentee_phone
     FROM sessions s JOIN users u ON s.mentee_id = u.id
     WHERE s.id = $1`,
    [id]
  );
  if (res.rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(res.rows[0]);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { action } = await req.json();
  const pool = await getPool();

  const next = action === "confirm" ? "confirmed" : action === "complete" ? "completed" : action === "cancel" ? "cancelled" : null;
  if (!next) return NextResponse.json({ error: "Bad action" }, { status: 400 });

  await pool.query("UPDATE sessions SET status = $1 WHERE id = $2", [next, id]);
  return NextResponse.json({ ok: true, status: next });
}