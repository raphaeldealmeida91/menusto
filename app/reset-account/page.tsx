"use client";

import Alert from "@/components/Alert";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { FormFieldBlock } from "@/components/ui/form";
import { resetAccountFormData, resetAccountSchema } from "@/Zod/Account";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function ResetAccountPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogDescription, setDialogDescription] = useState("");
  const [dialogVariant, setDialogVariant] = useState<"success" | "error">(
    "success"
  );
  const form = useForm<resetAccountFormData>({
    resolver: zodResolver(resetAccountSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: resetAccountFormData) {
    try {
      const res = await fetch("/api/reset-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur inconnue");
      }

      setDialogTitle("Succès");
      setDialogDescription(
        "L'email a été envoyé avec succès ! Cliquez sur le lien pour réinitialiser ou activer votre compte."
      );
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
  }

  return (
    <div className="w-screen h-screen flex flex-col">
      <Navigation />
      <div className="w-full h-full flex justify-center items-center flex-col gap-12 bg-background">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Réinitialiser ou activer votre compte
            </h1>
            <p className="mt-2 text-muted-foreground text-sm sm:text-base">
              Vous allez recevoir un lien par email, qui vous permettra de
              réinitialiser votre mot de passe et par la même occasion d'activer
              votre compte !
            </p>
          </div>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 bg-card p-6 rounded-2xl shadow-md border"
            >
              <FormFieldBlock
                control={form.control}
                name="email"
                label="Email"
                type="email"
                placeholder="contact@restaurant.com"
                disabled={true}
              />
              <Button
                type="submit"
                className="w-full font-semibold uppercase"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Envoi en cours..."
                  : "Envoyer un email"}
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
      <Alert
        open={dialogOpen}
        setOpen={setDialogOpen}
        title={dialogTitle}
        description={dialogDescription}
        variant={dialogVariant}
        redirectTo="/"
      />
    </div>
  );
}
