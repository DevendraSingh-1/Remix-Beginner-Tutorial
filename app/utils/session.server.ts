// app/utils/session.server.ts
import { createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
  userId: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: "__session",
    secrets: [process.env.SESSION_SECRET || "fallback_secret"],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});

export { getSession, commitSession, destroySession };
