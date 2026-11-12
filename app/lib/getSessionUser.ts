import { getSession } from "./session";

export async function getSessionUser() {
  const session = await getSession();
  return session.user;
}