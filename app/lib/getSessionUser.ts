import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "./session";

export async function getSessionUser() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  return session.user;
}