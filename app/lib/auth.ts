import { getPool } from "@/lib/db";
import bcrypt from "bcryptjs";

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export async function authenticateUser(email: string, password: string) {
  const pool = await getPool();
  
  const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  const user = res.rows[0];

  if (!user) {
    throw new AuthenticationError("Invalid email or password");
  }

  // Compare the provided password with the hashed password in the DB
  const isValid = await bcrypt.compare(password, user.password);
  
  if (!isValid) {
    throw new AuthenticationError("Invalid email or password");
  }

  return user;
}

// FIXED: Use the existing getSession function instead of sessionOptions
export async function signOut() {
  const { getSession } = await import("./session");
  const session = await getSession();
  session.destroy();
}