import { cookies } from "next/headers";
import { prisma } from "./prisma";

const COOKIE_NAME = "tmj_session";

export async function getOrCreateSessionId() {
  const store = cookies();
  const existing = store.get(COOKIE_NAME)?.value;
  if (existing) {
    return existing;
  }
  const session = await prisma.userSession.create({ data: {} });
  store.set(COOKIE_NAME, session.id, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return session.id;
}
