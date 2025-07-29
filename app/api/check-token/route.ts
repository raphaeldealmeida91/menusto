import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "Token manquant" },
        { status: 400 }
      );
    }

    const tokenRecord = await prisma.accountCreationToken.findUnique({
      where: { token },
      select: { expiresAt: true, email: true },
    });

    if (!tokenRecord) {
      return NextResponse.json({ error: "Token invalide" }, { status: 400 });
    }

    if (new Date(tokenRecord.expiresAt).getTime() < Date.now()) {
      await prisma.accountCreationToken.delete({ where: { token } });
      return NextResponse.json({ error: "Token expiré" }, { status: 400 });
    }

    return NextResponse.json({ email: tokenRecord.email, valid: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { valid: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
