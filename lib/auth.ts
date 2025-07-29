import { NextApiRequest, NextApiResponse } from "next";
import { getIronSession, IronSession } from "iron-session";
import { NextApiRequestWithSession, SessionUser } from "@/Interfaces/session";
import { sessionOptions } from "./session";

export function withSessionUser(
  handler: (
    req: NextApiRequestWithSession,
    res: NextApiResponse
  ) => Promise<void> | void
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = (await getIronSession(
      req,
      res,
      sessionOptions
    )) as IronSession<Partial<SessionUser>>;

    if (!session.user) {
      return res.status(401).json({ error: "Non authentifié" });
    }

    (req as NextApiRequestWithSession).session =
      session as IronSession<SessionUser>;

    return handler(req as NextApiRequestWithSession, res);
  };
}
