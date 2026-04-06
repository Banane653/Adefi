"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getEmbedUrl } from "@/lib/utils"; 

export async function addVideo(formData: FormData) {
    // 1. On récupère TOUTES les valeurs du formulaire
    const rawUrl = formData.get("url") as string;
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    const category = formData.get("category") as string; // ex: Restaurateur
    const vibe = formData.get("vibe") as string;         // ex: Dynamique
    const views = parseInt(formData.get("views") as string) || 0;
    const likes = parseInt(formData.get("likes") as string) || 0;
    const tagsString = formData.get("tags") as string;
    const tagTypeInput = formData.get("tagType") as string;
    const { embedUrl, platform } = getEmbedUrl(rawUrl);
    const tagType = tagTypeInput === "FORMAT" ? "FORMAT" : "NICHE";

    if (platform === "unknown") {
        console.error("URL non supportée ou invalide");
        return;
      }
  
    // 2. Vérification de sécurité de base
    if (!url || !platform || !title) {
      console.error("Champs obligatoires manquants");
      return;
    }
  
    try {
      const tagsArray = tagsString
        ? tagsString.split(",").map((t) => t.trim().toLowerCase()).filter(t => t !== "")
        : [];
  
      // 3. On envoie TOUT à Prisma
      await prisma.video.create({
        data: {
          title,      // ✅ Requis par ton schéma
          url: embedUrl,        // ✅ Requis par ton schéma
          platform: platform,   // ✅ Requis par ton schéma
          category,   // ✅ Requis pour ton feed
          vibe,       // ✅ Requis pour ton feed
          views,
          likes,
          tags: {
            connectOrCreate: tagsArray.map((name) => ({
              where: { name },
              create: { 
                name, 
                type: tagType 
              },
            })),
          },
        },
      });
  
      revalidatePath("/admin");
      revalidatePath("/feed");
    } catch (error) {
      console.error("❌ Erreur d'insertion :", error);
    }
  }

export async function deleteVideo(id: string) {
    try {
      await prisma.video.delete({
        where: { id },
      });
      
      // On rafraîchit la page pour que la vidéo disparaisse instantanément
      revalidatePath("/");
      revalidatePath("/admin");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  }