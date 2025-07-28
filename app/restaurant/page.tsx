"use client";

import { Form, FormFieldBlock } from "@/components/ui/form";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { restaurantFormData, restaurantSchema } from "@/Zod/Restaurants";
import RestaurantPreview from "@/components/RestaurantPreview";

export default function Restaurant() {
  const router = useRouter();

  const form = useForm<restaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: "",
      address: "",
      description: "",
      email: "",
      phoneNumber: "",
      banner: undefined,
    },
  });

  const values = useWatch({ control: form.control });
  const [error, setError] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const bannerUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (values.banner?.length) {
      if (bannerUrlRef.current) {
        URL.revokeObjectURL(bannerUrlRef.current);
      }

      const file = values.banner[0];
      const url = URL.createObjectURL(file);
      bannerUrlRef.current = url;
      setBannerPreview(url);
    }
  }, [values.banner]);

  const onSubmit = async (values: restaurantFormData) => {
    setError(null);
    try {
      if (values.banner?.[0] && values.banner[0].size > 5 * 1024 * 1024) {
        setError("L'image ne doit pas dépasser 5 Mo.");
        return;
      }
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("address", values.address);
      formData.append("description", values.description || "");
      formData.append("email", values.email);
      formData.append("phoneNumber", values.phoneNumber);
      if (values.banner?.[0]) {
        formData.append("banner", values.banner[0]);
      }

      const res = await fetch("/api/restaurants", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur inconnue");
      }

      console.log("Restaurant créé :", data.restaurant);
    } catch (e: any) {
      const message = e?.message || "Erreur réseau, veuillez réessayer.";
      console.error("Erreur réseau :", e);
      setError(message);
    }
  };

  return (
    <div className="max-w-screen min-h-screen flex justify-start items-start flex-col gap-12 overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-12 w-full h-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-full h-full flex-1 p-10 justify-center"
          >
            <h1 className="flex text-4xl font-bold gap-2 place-items-center">
              <ArrowLeft
                className="size-10 cursor-pointer"
                onClick={() => router.push("/")}
              />
              Créer votre page
            </h1>
            <FormFieldBlock
              control={form.control}
              name="name"
              label="Nom de votre restaurant"
              placeholder="Roi de la pizza"
              description={`Ceci sera aussi le nom de la page du restaurant. Par exemple : "https://menusto/roidelapizza.com"`}
            />
            <FormFieldBlock
              control={form.control}
              name="address"
              label="Adresse du restaurant"
              placeholder="123 rue de la République, Paris"
            />
            <FormFieldBlock
              control={form.control}
              name="description"
              label="Description du restaurant"
              type="textarea"
              placeholder="Une petite description de votre restaurant..."
              description="Optionnel, 200 caractères maximum."
            />
            <FormFieldBlock
              control={form.control}
              name="email"
              label="Email du restaurant"
              type="email"
              placeholder="exemple@restaurant.com"
            />
            <FormFieldBlock
              control={form.control}
              name="phoneNumber"
              label="Numéro de téléphone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
            />
            <FormFieldBlock
              control={form.control}
              name="banner"
              label="Bannière du restaurant"
              type="file"
              accept="image/*"
              onChange={(e) => form.setValue("banner", e.target.files)}
              description="Une image pour la bannière du restaurant."
            />
            <Button
              type="submit"
              className="font-bold uppercase"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Ajout en cours..." : "Ajouter"}
            </Button>
            <p>
              Une fois votre restaurant ajouté, vous recevrez par email un lien
              qui vous permettra de créer vos identifiant pour gérer votre
              établissement !
            </p>
          </form>
        </Form>
        <div className="flex-1 max-w-full bg-white  shadow-lg overflow-hidden">
          <RestaurantPreview values={values} bannerPreview={bannerPreview} />
        </div>
      </div>
    </div>
  );
}
