import { sessionOptions } from "@/lib/session";
import { getIronSession, IronSession } from "iron-session";
import { SessionUser } from "@/Interfaces/session";
import { AlertTriangle } from "lucide-react";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import DashboardWithDrawer from "@/components/DashboardWithDrawer";

export default async function DashboardPage() {
  const req = {
    headers: headers(),
    cookies: cookies(),
  } as unknown as Request;

  const res = new Response();

  const session = (await getIronSession(
    req,
    res,
    sessionOptions
  )) as IronSession<Partial<SessionUser>>;

  if (!session.user) {
    return (
      <div className="w-screen h-screen flex flex-col">
        <div className="w-screen h-screen flex flex-col items-center justify-center space-y-4 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <p className="text-destructive text-2xl font-bold">Connectez-vous</p>
          <p className="text-muted-foreground">
            Vous devez être connecté pour accèder à cette page !
          </p>
          <Link
            href="/connect-account"
            className="hover:underline hover:text-primary transition"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  const user = session.user;

  return <DashboardWithDrawer userEmail={session.user.email} />;
}
