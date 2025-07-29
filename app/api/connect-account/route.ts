import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { connectAccountSchema } from "@/Zod/Account";
import { NextRequest, NextResponse } from "next/server";
import { getIronSession, IronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { SessionUser } from "@/Interfaces/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = connectAccountSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const email = parsed.data.email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: "Email ou mot de passe invalide" },
        { status: 401 }
      );
    }

    const isValidPassword = await argon2.verify(
      user.password,
      parsed.data.password
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Email ou mot de passe invalide" },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ success: true });

    const session = (await getIronSession(
      req,
      res,
      sessionOptions
    )) as IronSession<Partial<SessionUser>>;

    session.user = { id: user.id, email: user.email };
    await session.save();

    return res;
  } catch (error) {
    console.error("Erreur connexion :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
