import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { requestAccountSchema } from "@/Zod/Account";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = requestAccountSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const email = parsed.data.email.trim().toLowerCase();
    const { password, token } = parsed.data;

    const accountToken = await prisma.accountCreationToken.findUnique({
      where: { token },
    });

    if (!accountToken) {
      return NextResponse.json({ error: "Token invalide" }, { status: 400 });
    }

    if (new Date(accountToken.expiresAt).getTime() < Date.now()) {
      await prisma.accountCreationToken.delete({ where: { token } });
      return NextResponse.json({ error: "Token expiré" }, { status: 400 });
    }

    const hashedPassword = await argon2.hash(password);

    await prisma.$transaction(async (tx) => {
      let user = await tx.user.findUnique({ where: { email } });

      if (user) {
        user = await tx.user.update({
          where: { email },
          data: { password: hashedPassword },
        });
      } else {
        user = await tx.user.create({
          data: { email, password: hashedPassword },
        });
      }

      await tx.restaurant.updateMany({
        where: { email, userId: null },
        data: { userId: user.id },
      });

      await tx.accountCreationToken.delete({ where: { token } });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur création de compte :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
