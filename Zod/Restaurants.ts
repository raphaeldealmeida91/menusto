import z from "zod";

const phoneRegex = /^[+]?[0-9\s\-]{7,15}$/;

const restaurantSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Le nom du restautant doit être d'au moins 3 caractères.",
    })
    .max(50, {
      message:
        "Le nom du restautant ne doit pas être de plus de 50 caractères.",
    }),
  address: z
    .string()
    .min(5, { message: "L'adresse doit être d'au moins 5 caractères." })
    .max(100, { message: "L'adresse ne doit pas dépasser 100 caractères." }),
  description: z
    .string()
    .max(200, {
      message: "La description ne doit pas dépasser 200 caractères.",
    })
    .optional()
    .or(z.literal("")),
  email: z.string().email({ message: "Email invalide." }),
  phoneNumber: z
    .string()
    .min(7, { message: "Numéro de téléphone trop court." })
    .max(15, { message: "Numéro de téléphone trop long." })
    .regex(phoneRegex, { message: "Format du numéro invalide." }),
  banner: z
    .any()
    .refine(
      (files) => files?.length === 1,
      "Veuillez sélectionner une image de bannière."
    )
    .refine(
      (files) => files?.[0]?.type.startsWith("image/"),
      "Le fichier doit être une image."
    ),
});

export type restaurantFormData = z.infer<typeof restaurantSchema>;

export { restaurantSchema };
