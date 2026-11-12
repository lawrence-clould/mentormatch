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
  const user: any = res.rows[0]; // <--- Added : any here

  if (!user) {
    throw new AuthenticationError("Invalid email or password");
  }

  const isValid = await bcrypt.compare(password, user.password);
  
  if (!isValid) {
    throw new AuthenticationError("Invalid email or password");
  }

  return user;
}

export async function signOut() {
  const { getSession } = await import("./session");
  const session = await getSession();
  session.destroy();
}