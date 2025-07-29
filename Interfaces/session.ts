import { NextApiRequest } from "next";
import { IronSession } from "iron-session";

export interface SessionUser {
  user: {
    id: string;
    email: string;
  };
}

export type NextApiRequestWithSession = NextApiRequest & {
  session: IronSession<SessionUser>;
};
