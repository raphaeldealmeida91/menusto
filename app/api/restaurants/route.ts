import { NextRequest, NextResponse } from "next/server";
import { mkdir } from "fs/promises";
import path from "path";
import { restaurantSchema } from "@/Zod/Restaurants";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { sendAccountCreationEmail } from "@/lib/mailer";
import sharp from "sharp";
import { Prisma } from "@/app/generated/prisma";

async function processBannerImage(banner: File) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(banner.type)) {
    throw new Error("Format de fichier non supporté");
  }

  const buffer = Buffer.from(await banner.arrayBuffer());
  const filename = `${uuidv4()}.webp`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadsDir, { recursive: true });

  const outputPath = path.join(uploadsDir, filename);

  await sharp(buffer)
    .resize({ width: 1280, height: 720, fit: "cover" })
    .webp({ quality: 80 })
    .toFile(outputPath);

  return `/uploads/${filename}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const dataRaw = {
      banner: formData.get("banner"),
      name: formData.get("name"),
      address: formData.get("address"),
      description: formData.get("description"),
      email: formData.get("email"),
      phoneNumber: formData.get("phoneNumber"),
    };

    const parsed = restaurantSchema.safeParse({
      ...dataRaw,
      banner: dataRaw.banner ? [dataRaw.banner] : [],
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { banner, name, address, description, email, phoneNumber } =
      parsed.data;

    const existingRestaurant = await prisma.restaurant.findUnique({
      where: { name },
    });

    if (existingRestaurant) {
      return NextResponse.json(
        { error: "Ce nom de restaurant est déjà utilisé." },
        { status: 400 }
      );
    }

    let imageUrl = "";
    if (banner.length > 0) {
      try {
        imageUrl = await processBannerImage(banner[0]);
      } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 });
      }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    let restaurantCreated;

    await prisma.$transaction(async (tx) => {
      const restaurantData: Prisma.RestaurantCreateInput = {
        name,
        address,
        description,
        email,
        phoneNumber,
        bannerUrl: imageUrl,
        user: existingUser ? { connect: { id: existingUser.id } } : undefined,
      };

      restaurantCreated = await tx.restaurant.create({ data: restaurantData });

      if (!existingUser) {
        await tx.accountCreationToken.deleteMany({
          where: { email },
        });
        const token = uuidv4();
        await tx.accountCreationToken.create({
          data: {
            token,
            email,
            expiresAt: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes
          },
        });
      }
    });

    if (!existingUser) {
      const tokenRecord = await prisma.accountCreationToken.findFirst({
        where: { email },
        orderBy: { expiresAt: "desc" },
      });
      if (tokenRecord) {
        await sendAccountCreationEmail(email, tokenRecord.token);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: existingUser
          ? "Le restaurant a été ajouté avec succès ! Connectez-vous à votre compte pour y avoir accès."
          : "Le restaurant a été ajouté avec succès ! Vérifiez votre email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de l'ajout du restaurant :", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
