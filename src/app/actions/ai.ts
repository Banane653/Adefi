"use server";

import { GoogleGenAI, Type } from "@google/genai";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

type GeneratedScript = {
  hook: string;
  script: string[];
  cta: string;
};

const GEMINI_TIMEOUT_MS = 20000;

type GeneratedScriptStore = {
  findUnique: (args: {
    where: { userId_videoId: { userId: string; videoId: string } };
    select: { hook: true; script: true; cta: true };
  }) => Promise<GeneratedScript | null>;
  upsert: (args: {
    where: { userId_videoId: { userId: string; videoId: string } };
    update: GeneratedScript;
    create: { userId: string; videoId: string; hook: string; script: string[]; cta: string };
  }) => Promise<GeneratedScript>;
};

function sanitizeJsonResponse(rawText: string) {
  return rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutMessage: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);

    promise
      .then((result) => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

export async function generateVideoScript(
  videoId: string,
  videoTitle: string,
  videoTags: string[],
  forceRegenerate = false
): Promise<GeneratedScript> {
  if (!videoId) {
    throw new Error("videoId manquant.");
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY manquante.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Non authentifié.");
  }
  const generatedScriptStore = (prisma as unknown as { generatedScript: GeneratedScriptStore }).generatedScript;

  let businessType = "entreprise locale";
  let city = "En ligne";
  let bestSeller = "son offre principale";

  try {
    const existingScript = await generatedScriptStore.findUnique({
      where: {
        userId_videoId: {
          userId: user.id,
          videoId,
        },
      },
      select: {
        hook: true,
        script: true,
        cta: true,
      },
    });

    if (existingScript && !forceRegenerate) {
      return existingScript;
    }

    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        businessType: true,
        city: true,
        best_seller: true,
      },
    });

    if (userProfile?.businessType) businessType = userProfile.businessType;
    if (userProfile?.city) city = userProfile.city;
    if (userProfile?.best_seller) bestSeller = userProfile.best_seller;
  } catch (error) {
    console.error("Erreur récupération cache/profil:", error);
  }

  // ICI DEBUT DU PROMPT
  const prompt = `Tu es un script doctor expert TikTok/Reels.

PRIORITE ABSOLUE: reproduire la mecanique de la video source, puis l'adapter au business.
La video source est la contrainte principale.

Video source:
- Titre: ${videoTitle}
- Tags: ${videoTags.join(", ")}

Business a adapter:
- Secteur: ${businessType}
- Ville: ${city}
- Offre principale: ${bestSeller}

Consignes:
1) Le hook doit reprendre le style, l'angle et la promesse implicite de la video source.
2) Le script doit contenir 3 a 4 phrases courtes et suivre la structure de la video source:
   hook -> contexte/preuve -> transformation -> resultat concret.
3) Le CTA doit etre coherent avec le ton et l'intention de la video source.
4) Evite les formulations generiques: chaque ligne doit etre ancree dans la video source.
5) N'invente pas un concept eloigne de la video source.

Reponds UNIQUEMENT en JSON strict avec 3 cles:
- "hook": string
- "script": string[]
- "cta": string`;

//ICI FIN DU PROMPT
  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hook: { type: Type.STRING },
              script: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              cta: { type: Type.STRING },
            },
            required: ["hook", "script", "cta"],
          },
        },
      }),
      GEMINI_TIMEOUT_MS,
      "Timeout Gemini: réponse trop lente."
    );

    const rawText = response.text;
    if (!rawText) {
      throw new Error("Réponse IA vide.");
    }

    const parsed = JSON.parse(sanitizeJsonResponse(rawText)) as Partial<GeneratedScript>;

    if (
      typeof parsed.hook !== "string" ||
      !Array.isArray(parsed.script) ||
      parsed.script.some((line) => typeof line !== "string") ||
      typeof parsed.cta !== "string"
    ) {
      throw new Error("Format JSON invalide retourné par l'IA.");
    }

    const generatedScript = {
      hook: parsed.hook,
      script: parsed.script.slice(0, 4),
      cta: parsed.cta,
    };

    await generatedScriptStore.upsert({
      where: {
        userId_videoId: {
          userId: user.id,
          videoId,
        },
      },
      update: generatedScript,
      create: {
        userId: user.id,
        videoId,
        ...generatedScript,
      },
    });

    return generatedScript;
  } catch (error) {
    console.error("Erreur génération script IA:", error);
    if (error instanceof Error && error.message.includes("Timeout Gemini")) {
      throw new Error("La génération prend trop de temps. Réessaie dans quelques secondes.");
    }
    throw new Error("Impossible de générer le script IA pour le moment.");
  }
}
