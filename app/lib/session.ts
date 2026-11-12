import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
  };
}

export async function getSession() {
  const session = await getIronSession<SessionData>(await cookies(), {
    password: process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long",
    cookieName: "mentormatch_session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });
  return session;
}