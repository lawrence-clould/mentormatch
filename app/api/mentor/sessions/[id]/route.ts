import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    const user = session.user;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const mentorId = parseInt(user.id as any, 10);
    const { id } = await params;
    const body = await req.json();
    const { action, meeting_link } = body;

    const pool = await getPool();

    // Step 4: Add Meeting Link
    if (meeting_link) {
      await pool.query("UPDATE sessions SET meeting_link = $1 WHERE id = $2 AND mentor_id = $3", [meeting_link, id, mentorId]);
    }

    // Step 5: Mark as Completed
    if (action === "complete") {
      await pool.query("UPDATE sessions SET status = 'completed' WHERE id = $1 AND mentor_id = $2", [id, mentorId]);
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}