import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const res = await pool.query("SELECT id, name, email, phone, role, status, programme, year_of_study FROM users WHERE role != 'admin' ORDER BY created_at DESC");
    
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}