import { SessionOptions } from "iron-session";

export const sessionOptions: SessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD!,
  cookieName: "menusto_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 jours (en secondes)
  },
};
