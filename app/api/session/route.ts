import { NextRequest, NextResponse } from "next/server";
import { getIronSession, IronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { SessionUser } from "@/Interfaces/session";

export async function GET(req: NextRequest) {
  const res = NextResponse.next();

  const session = (await getIronSession(
    req,
    res,
    sessionOptions
  )) as IronSession<Partial<SessionUser>>;

  if (!session.user) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({ authenticated: true, user: session.user });
}
