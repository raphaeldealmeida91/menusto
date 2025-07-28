"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col gap-12">
      <h1 className="text-5xl w-1/2 text-center font-bold">
        <span className="text-amber-500">Menusto</span>, retrouvez tous les
        menus de vos restaurants préférés !
      </h1>
      <div className="flex gap-4">
        <Button
          size="lg"
          className="font-bold uppercase cursor-pointer"
          onClick={() => router.push("/restaurant")}
        >
          Ajouter votre carte
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="font-bold uppercase cursor-pointer"
        >
          Trouver votre carte
        </Button>
      </div>
    </div>
  );
}
