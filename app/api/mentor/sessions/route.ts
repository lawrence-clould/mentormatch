import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const pool = await getPool();
    const mentorId = 1;
    const url = new URL(req.url);
    const filter = url.searchParams.get("filter") || "all";

    let extra = "";
    if (filter === "upcoming") extra = " AND s.session_date > NOW() AND s.status IN ('pending','confirmed')";
    else if (filter === "completed") extra = " AND s.status = 'completed'";
    else if (filter === "pending") extra = " AND s.status = 'pending'";
    else if (filter === "requests") extra = " AND s.status = 'pending' AND s.payment_status = 'paid_to_admin'";
    else if (filter === "cancelled") extra = " AND s.status = 'cancelled'";

    const res: any = await pool.query(
      `SELECT s.*, u.name as mentee_name, u.email as mentee_email
       FROM sessions s JOIN users u ON s.mentee_id = u.id
       WHERE s.mentor_id = $1 ${extra}
       ORDER BY s.session_date ${filter === "completed" ? "DESC" : "ASC"}`,
      [mentorId]
    );
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error("Mentor sessions error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}