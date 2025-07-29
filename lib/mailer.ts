import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendAccountCreationEmail(email: string, token: string) {
  const link = `${process.env.APP_URL}/create-account?token=${token}`;
  try {
    await transporter.sendMail({
      from: '"Menusto" <no-reply@menusto.com>',
      to: email,
      subject: "Créez votre compte Menusto",
      html: `
      <h2>Bienvenue chez Menusto !</h2>
      <p>Merci d’avoir inscrit votre restaurant.</p>
      <p>Pour créer vos identifiants, cliquez sur le lien suivant :</p>
      <p><a href="${link}" target="_blank">${link}</a></p>
      <br/>
      <p>Ce lien est valable pour une durée limitée.</p>
    `,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    throw error;
  }
}
