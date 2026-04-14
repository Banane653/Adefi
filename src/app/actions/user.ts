"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Non authentifié");

  // Récupération des nouveaux champs
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const companyName = formData.get("companyName") as string;
  const businessType = formData.get("businessType") as string;
  const best_seller = formData.get("best_seller") as string;
  const city = formData.get("city") as string;
  const production_capacity = formData.get("production_capacity") as string;
  const editing_level = formData.get("editing_level") as string;
  const camera_people = formData.get("camera_people") as string;
  const vibe = formData.getAll("vibe") as string[];

  await prisma.user.upsert({
    where: { id: user.id },
    update: { 
      firstName, 
      lastName, 
      companyName, 
      businessType, 
      best_seller,
      city,
      production_capacity,
      editing_level,
      camera_people,
      vibe 
    },
    create: { 
      id: user.id, 
      email: user.email!, 
      firstName, 
      lastName, 
      companyName, 
      businessType, 
      best_seller,
      city,
      production_capacity,
      editing_level,
      camera_people,
      vibe 
    },
  });

  redirect("/dashboard");
}