"use client";

import Alert from "@/components/Alert";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { FormFieldBlock } from "@/components/ui/form";
import { createAccountFormData, createAccountSchema } from "@/Zod/Account";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function CreateAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogDescription, setDialogDescription] = useState("");
  const [dialogVariant, setDialogVariant] = useState<"success" | "error">(
    "success"
  );

  const form = useForm<createAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!token) {
      setValid(false);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const checkToken = async () => {
      try {
        const res = await fetch(
          `/api/check-token?token=${encodeURIComponent(token)}`
        );
        const data = await res.json();

        if (!isMounted) return;

        if (data.valid) {
          setValid(true);
          setEmail(data.email);
          form.reset({
            email: data.email,
            password: "",
            confirmPassword: "",
          });
        } else {
          setValid(false);
          setError(data.error || "Token invalide");
        }
      } catch (err) {
        if (isMounted) {
          setValid(false);
          setError("Erreur réseau");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkToken();

    return () => {
      isMounted = false;
    };
  }, [token, form.reset]);

  async function onSubmit(data: createAccountFormData) {
    if (!token) return;

    try {
      const res = await fetch("/api/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, token }),
      });

      if (res.ok) {
        setDialogTitle("Succès");
        setDialogDescription("Compte créé avec succès !");
        setDialogVariant("success");
        setDialogOpen(true);
        form.reset();
      } else {
        const json = await res.json();
        setDialogTitle("Erreur");
        setDialogDescription(json.error || "Erreur inconnue");
        setDialogVariant("error");
        setDialogOpen(true);
      }
    } catch (e) {
      setDialogTitle("Erreur");
      setDialogDescription("Erreur réseau");
      setDialogVariant("error");
      setDialogOpen(true);
    }
  }

  if (loading && email === null)
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center space-y-4 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="font-semibold text-xl text-muted-foreground">
          Vérification du lien en cours...
        </p>
      </div>
    );

  if (!valid)
    return (
      <div className="w-screen h-screen flex flex-col">
        <Navigation />
        <div className="w-screen h-screen flex flex-col items-center justify-center space-y-4 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <p className="text-destructive text-2xl font-bold">
            {error || "Lien invalide ou expiré"}
          </p>
          <p className="text-muted-foreground">
            Vérifie que tu as bien cliqué sur le lien le plus récent ou demande
            un nouveau lien.
          </p>
          <Button
            className="cursor-pointer mt-1 uppercase font-bold"
            size="sm"
            onClick={() => router.push("/")}
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );

  return (
    <div className="w-screen h-screen flex flex-col">
      <Navigation />
      <div className="w-full h-full flex justify-center items-center flex-col gap-12 bg-background">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Création d'un compte
            </h1>
            <p className="mt-2 text-muted-foreground text-sm sm:text-base">
              Ce compte aura un accès administrateur sur votre établissement. Il
              pourra tout gérer.
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
              <FormFieldBlock
                control={form.control}
                name="password"
                label="Mot de passe"
                type="password"
                placeholder="Votre mot de passe"
                description="Minimum 8 caractères."
              />
              <FormFieldBlock
                control={form.control}
                name="confirmPassword"
                label="Confirmer le mot de passe"
                type="password"
                placeholder="Confirmez votre mot de passe"
                description="Les mots de passe doivent être identiques."
              />

              <Button
                type="submit"
                className="w-full font-semibold uppercase"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Création en cours..."
                  : "Créer mon compte"}
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
