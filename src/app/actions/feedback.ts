"use server";

import { Resend } from "resend";
import prisma from "@/lib/prisma"; 
import { createClient } from "@/utils/supabase/server"; 

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitFeedback(formData: FormData) {
  try {
    // 1. Authentification Supabase
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // Si personne n'est connecté, on bloque
    if (authError || !user) {
      return { success: false, error: "Tu dois être connecté pour envoyer un retour." };
    }

    // 2. Récupération des données du formulaire
    const category = formData.get("category") as string;
    const content = formData.get("content") as string;
    let imageUrl = null; // On garde null pour le moment (MVP)

    // Optionnel : Récupérer les infos Prisma de l'utilisateur pour l'email
    // (Pour savoir exactement QUI te parle dans l'email)
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id } // Si tu lies via email : { email: user.email }
    });
    const userName = dbUser?.firstName || user.email;
    const userBusiness = dbUser?.companyName || "Non renseigné";

    // 3. Sauvegarde dans la base de données Prisma
    await prisma.feedback.create({
      data: {
        userId: user.id, // L'ID Supabase du client
        category,
        content,
        imageUrl,
      },
    });

    // 4. Envoi de l'email via Resend
    const { error: resendError } = await resend.emails.send({
      from: "Feedback App <onboarding@resend.dev>", 
      to: ["natrist@hotmail.com"], // ⚠️ Toujours ton email ici
      subject: `🚨 Retour Beta de ${userName} (${category})`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #2563eb;">Nouveau feedback reçu !</h2>
          <p><strong>De :</strong> ${userName} (${user.email})</p>
          <p><strong>Business :</strong> ${userBusiness}</p>
          <p><strong>Catégorie :</strong> ${category}</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <h3>Message :</h3>
          <blockquote style="background: #f4f4f5; padding: 15px; border-left: 4px solid #2563eb; border-radius: 4px; white-space: pre-wrap;">
            ${content}
          </blockquote>
          ${imageUrl ? `<p><strong>Image :</strong> <a href="${imageUrl}">Voir la capture jointe</a></p>` : ""}
        </div>
      `,
    });

    if (resendError) {
      console.error("Erreur Resend:", resendError);
      return { success: false, error: "Sauvegardé, mais l'email a échoué." };
    }

    return { success: true };
  } catch (error) {
    console.error("Erreur Server Action:", error);
    return { success: false, error: "Une erreur critique est survenue." };
  }
}