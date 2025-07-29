import { getIronSession, IronSession } from "iron-session";
import { NextRequest } from "next/server";
import { sessionOptions } from "@/lib/session";
import { SessionUser } from "@/Interfaces/session";

export async function getSessionUser(req: NextRequest) {
  const res = new Response();

  const session = (await getIronSession(
    req,
    res,
    sessionOptions
  )) as IronSession<Partial<SessionUser>>;

  return session.user || null;
}
