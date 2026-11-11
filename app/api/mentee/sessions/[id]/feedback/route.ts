import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { rating, comments } = await req.json();
  const pool = await getPool();

  const session: any = await pool.query(
    "SELECT mentor_id, mentee_id FROM sessions WHERE id = $1",
    [id]
  );

  if (session.rows.length === 0) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const { mentor_id, mentee_id } = session.rows[0];

  await pool.query(
    "INSERT INTO feedback (session_id, mentee_id, mentor_id, rating, comments) VALUES ($1, $2, $3, $4, $5)",
    [id, mentee_id, mentor_id, rating, comments]
  );

  return NextResponse.json({ ok: true });
}