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
      {" "}
      {bannerPreview ? (
        <div className="relative max-w-full h-68">
          <Image
            src={bannerPreview}
            alt="Bannière restaurant"
            className="w-full h-full object-cover"
            width={500}
            height={500}
          />
          <div className="absolute inset-0  bg-opacity-40 flex flex-col justify-end items-start p-2">
            <h2 className="text-dark text-3xl font-bold drop-shadow-md">
              {values.name || "Nom du restaurant"}
            </h2>
            <p className="text-dark mt-2 max-h-20 overflow-hidden text-ellipsis">
              {values.description || "Description du restaurant"}
            </p>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-68 bg-accent">
          <div className="absolute inset-0  bg-opacity-40 flex flex-col justify-end items-start p-2">
            <h2 className="text-dark text-3xl font-bold drop-shadow-md">
              {values.name || "Nom du restaurant"}
            </h2>
            <p className="text-dark mt-2 max-h-20 overflow-hidden text-ellipsis">
              {values.description || "Description du restaurant"}
            </p>
          </div>
        </div>
      )}
      <div className="flex max-w-full justify-between px-4 py-2">
        <div className="flex flex-col">
          <p className="text-gray-600 flex gap-2  py-2 text-sm">
            <MapPin className="size-5" />
            {values.address || "Adresse du restaurant"}
          </p>
          <p className="text-gray-600 flex gap-2  py-2 text-sm">Avis 99+</p>
          <div className="flex">
            <p className="text-gray-600 flex gap-2  py-2 text-sm items-center">
              Note
            </p>
            <Rating className="w-5 h-5" value={4} readOnly />
          </div>
          <p className="text-gray-600 flex gap-2  py-2 text-sm">Prix --$$</p>
        </div>
        <div className="flex flex-col">
          <p className="text-gray-600 flex gap-2  py-2 text-sm">
            <Mail className="size-5" />
            {values.email || "email@exemple.com"}
          </p>
          <p className="text-gray-600 flex gap-2  py-2 text-sm">
            <Phone className="size-5" />{" "}
            {values.phoneNumber || "+33 0 00 00 00 00"}
          </p>
        </div>
      </div>
      <div className="flex flex-col px-4 gap-4">
        <h1 className="flex font-bold text-lg">Cartes</h1>
        <SkeletonCardList count={7} />
      </div>
    </div>
  );
}
