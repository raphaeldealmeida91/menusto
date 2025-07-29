import z from "zod";

const requestAccountSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(8, "Mot de passe trop court (8 caractères minimum)"),
  token: z.string().uuid("Token invalide"),
});

export type requestAccountFormData = z.infer<typeof requestAccountSchema>;

const createAccountSchema = z
  .object({
    email: z.string().email({ message: "Email invalide" }),
    password: z
      .string()
      .min(8, "Mot de passe trop court (8 caractères minimum)"),
    confirmPassword: z.string().min(8, "Confirme ton mot de passe"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type createAccountFormData = z.infer<typeof createAccountSchema>;

const connectAccountSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(8, "Mot de passe trop court (8 caractères minimum)"),
});

export type connectAccountFormData = z.infer<typeof connectAccountSchema>;

const resetAccountSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
});

export type resetAccountFormData = z.infer<typeof resetAccountSchema>;

export {
  requestAccountSchema,
  createAccountSchema,
  connectAccountSchema,
  resetAccountSchema,
};
