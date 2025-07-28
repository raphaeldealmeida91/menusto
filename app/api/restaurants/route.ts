import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { restaurantSchema } from "@/Zod/Restaurants";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const banner = formData.get("banner") as File | null;
    const name = formData.get("name")?.toString() || "";
    const address = formData.get("address")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const phoneNumber = formData.get("phoneNumber")?.toString() || "";

    const parsed = restaurantSchema.safeParse({
      name,
      address,
      description,
      email,
      phoneNumber,
      banner: banner ? [banner] : [],
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    let imageUrl = "";

    if (banner) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(banner.type)) {
        return NextResponse.json(
          { error: "Format de fichier non supporté" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await banner.arrayBuffer());
      const filename = `${uuidv4()}-${banner.name.replace(/\s+/g, "-")}`;
      const filepath = path.posix.join("public", "uploads", filename);
      await writeFile(path.join(process.cwd(), filepath), buffer);
      imageUrl = `/uploads/${filename}`;
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        address,
        description,
        email,
        phoneNumber,
        bannerUrl: imageUrl,
      },
    });

    return NextResponse.json({ success: true, restaurant }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'ajout du restaurant :", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
