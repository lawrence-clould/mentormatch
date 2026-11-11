import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pool = await getPool();
    
    const res: any = await pool.query(`
      SELECT s.*, u.name as mentor_name, u.email as mentor_email
      FROM sessions s
      JOIN users u ON s.mentor_id = u.id
      WHERE s.id = $1
    `, [id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(res.rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}