"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addVideo(formData: FormData) {
  const url = formData.get("url") as string;
  const platform = formData.get("platform") as string;
  const views = parseInt(formData.get("views") as string) || 0;
  const tagsString = formData.get("tags") as string;
  const tagTypeInput = formData.get("tagType") as string;

  // On s'assure que le type correspond exactement à ton Enum Prisma
  const tagType = tagTypeInput === "FORMAT" ? "FORMAT" : "NICHE";

  if (!url) return;

  try {
    const tagsArray = tagsString
      ? tagsString.split(",").map((t) => t.trim().toLowerCase()).filter(t => t !== "")
      : [];

    await prisma.video.create({
      data: {
        url,
        platform,
        views,
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

    // On rafraîchit tout
    revalidatePath("/");
    revalidatePath("/admin");
  } catch (error) {
    console.error("❌ Erreur d'insertion :", error);
  }
  // IMPORTANT : On ne retourne RIEN.
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