import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendAccountCreationEmail } from "@/lib/mailer";
import { v4 as uuidv4 } from "uuid";
import { resetAccountSchema } from "@/Zod/Account";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = resetAccountSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const email = parsed.data.email.trim().toLowerCase();

    const restaurantExists = await prisma.restaurant.findFirst({
      where: { email },
      select: { id: true },
    });

    if (!restaurantExists) {
      await prisma.accountCreationToken.deleteMany({
        where: { email: email },
      });
      return NextResponse.json(
        { error: "Aucun compte trouvé" },
        { status: 404 }
      );
    }

    const token = uuidv4();

    await prisma.$transaction(async (tx) => {
      await tx.accountCreationToken.deleteMany({
        where: { email: email },
      });

      await tx.accountCreationToken.create({
        data: {
          token,
          email,
          expiresAt: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes
        },
      });
    });

    await sendAccountCreationEmail(email, token);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Erreur envoi reset email :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
