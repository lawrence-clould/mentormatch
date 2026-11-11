import { SessionOptions } from "iron-session";

export interface SessionData {
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
  };
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long",
  cookieName: "mentormatch_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};