"use client";

import { Form, FormFieldBlock } from "@/components/ui/form";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { restaurantFormData, restaurantSchema } from "@/Zod/Restaurants";
import RestaurantPreview from "@/components/RestaurantPreview";
import Alert from "@/components/Alert";
import Navigation from "@/components/Navigation";

export default function CreateRestaurantPage() {
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
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const bannerUrlRef = useRef<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogDescription, setDialogDescription] = useState("");
  const [dialogVariant, setDialogVariant] = useState<"success" | "error">(
    "success"
  );

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
    try {
      if (values.banner?.[0] && values.banner[0].size > 5 * 1024 * 1024) {
        setDialogTitle("Erreur");
        setDialogDescription(
          "L'image est trop lourde. Elle doit faire moins de 5 Mo."
        );
        setDialogVariant("error");
        setDialogOpen(true);
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

      setDialogTitle("Succès");
      setDialogDescription(data.message);
      setDialogVariant("success");
      setDialogOpen(true);
      form.reset();
    } catch (e: any) {
      const message = e?.message || "Erreur réseau, veuillez réessayer.";
      console.error("Erreur réseau :", e);
      setDialogTitle("Erreur");
      setDialogDescription(message);
      setDialogVariant("error");
      setDialogOpen(true);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navigation />
      <div className="flex flex-col lg:flex-row w-full h-full px-8 gap-8 py-8 bg-background overflow-hidden">
        <div className="w-full lg:w-1/2 h-full rounded-xl border border-muted shadow-sm bg-white dark:bg-muted p-4">
          <h1 className="text-3xl font-bold mb-4">Ajouter votre restaurant</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormFieldBlock
                control={form.control}
                name="name"
                label="Nom du restaurant"
                placeholder="Roi de la pizza"
                description='Ce nom sera visible sur la page publique. Exemple : "https://menusto/roidelapizza.com"'
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
                placeholder="Une brève présentation de votre établissement..."
                description="Optionnel. 200 caractères max."
              />
              <FormFieldBlock
                control={form.control}
                name="email"
                label="Email du restaurant"
                type="email"
                placeholder="contact@restaurant.com"
              />
              <FormFieldBlock
                control={form.control}
                name="phoneNumber"
                label="Téléphone du restaurant"
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
                description="Choisissez une image représentant votre restaurant."
              />

              <Button
                type="submit"
                className="w-full font-bold uppercase cursor-pointer"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Ajout en cours..."
                  : "Ajouter mon restaurant"}
              </Button>

              <p className="text-sm text-muted-foreground">
                Une fois ajouté, vous recevrez un lien par email pour créer vos
                identifiants et gérer votre établissement.
              </p>
            </form>
          </Form>
        </div>

        <div className="w-full lg:w-1/2 h-full rounded-xl border border-muted shadow-sm bg-white dark:bg-muted p-4">
          <RestaurantPreview values={values} bannerPreview={bannerPreview} />
        </div>
      </div>
      <Alert
        open={dialogOpen}
        setOpen={setDialogOpen}
        title={dialogTitle}
        description={dialogDescription}
        variant={dialogVariant}
        redirectTo={dialogVariant === "success" ? "/" : "/create-restaurant"}
      />
    </div>
  );
}
