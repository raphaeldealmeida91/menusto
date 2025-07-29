"use client";

import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { FormFieldBlock } from "@/components/ui/form";
import { connectAccountFormData, connectAccountSchema } from "@/Zod/Account";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";

export default function ConnectAccountPage() {
  const router = useRouter();
  const form = useForm<connectAccountFormData>({
    resolver: zodResolver(connectAccountSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: connectAccountFormData) {
    try {
      const res = await fetch("/api/connect-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur inconnue");
      }

      form.reset();
      router.push("/dashboard");
    } catch (e: any) {
      const message = e?.message || "Erreur réseau, veuillez réessayer.";
      console.error("Erreur réseau :", e);
    }
  }

  return (
    <div className="w-screen h-screen flex flex-col">
      <Navigation />
      <div className="w-full h-full flex justify-center items-center flex-col gap-12 bg-background">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Connecter votre restaurant
            </h1>
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
              <FormFieldBlock
                control={form.control}
                name="password"
                label="Mot de passe"
                type="password"
                placeholder="Votre mot de passe"
                description="Minimum 8 caractères."
              />

              <Button
                type="submit"
                className="w-full font-semibold uppercase"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Connexion en cours..."
                  : "Se connecter"}
              </Button>
              <div className="text-left text-sm text-muted-foreground">
                <Link
                  href="/reset-account"
                  className="hover:underline hover:text-primary transition"
                >
                  Mot de passe oublié ? Ou vous n’avez pas activé votre compte ?
                </Link>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
