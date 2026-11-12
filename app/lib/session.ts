import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  user?: { ... };
}

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), { ... });
}