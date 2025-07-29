import { Mail, MapPin, Phone } from "lucide-react";
import { SkeletonCardList } from "./ui/skeleton";
import { Rating } from "./ui/Rating";
import Image from "next/image";
import { restaurantFormData } from "@/Zod/Restaurants";

interface RestaurantPreviewProps {
  values: Partial<restaurantFormData>;
  bannerPreview: string | null;
}

export default function RestaurantPreview({
  values,
  bannerPreview,
}: RestaurantPreviewProps) {
  return (
    <div>
      <div className="relative h-60 w-full">
        {bannerPreview ? (
          <Image
            src={bannerPreview}
            alt="Bannière restaurant"
            className="w-full h-full object-cover"
            fill
          />
        ) : (
          <div className="w-full h-full bg-accent flex items-center justify-center text-muted-foreground">
            <span>Pas d’image disponible</span>
          </div>
        )}
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
          <h2 className="text-white text-2xl font-bold drop-shadow">
            {values.name || "Nom du restaurant"}
          </h2>
          <p className="text-white text-sm mt-1 line-clamp-2">
            {values.description || "Description du restaurant"}
          </p>
        </div>
      </div>

      <div className="p-4 flex flex-col md:flex-row md:justify-between gap-4">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{values.address || "Adresse du restaurant"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Avis 99+</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Note :</span>
            <Rating className="w-5 h-5" value={4} readOnly />
          </div>
          <div className="flex items-center gap-2">
            <span>Prix :</span>
            <span>--$$</span>
          </div>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>{values.email || "contact@restaurant.com"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>{values.phoneNumber || "+33 6 12 34 56 78"}</span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <h3 className="font-semibold text-lg mb-3">Menu</h3>
        <SkeletonCardList count={5} />
      </div>
    </div>
  );
}
