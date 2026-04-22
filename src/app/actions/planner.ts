"use server";

import { GoogleGenAI, Type } from "@google/genai";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

type GeneratedPlanTask = {
  day: string;
  title: string;
  description: string;
  objective: string;
  hook: string;
  script: string[];
  cta: string;
  format_inspiration: string;
};

const GEMINI_TIMEOUT_MS = 25000;
const DAY_ORDER = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

function sanitizeJsonResponse(rawText: string) {
  return rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutMessage: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
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

function getCurrentWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const start = new Date(now);
  start.setDate(now.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function inferProductionCount(capacity: string | null) {
  const normalized = (capacity ?? "").toLowerCase();
  if (normalized.includes("1-2")) return 2;
  if (normalized.includes("3-4")) return 3;
  if (normalized.includes("5-6")) return 5;
  if (normalized.includes("7")) return 7;
  return 3;
}

function getDayOrder(day: string) {
  const normalizedDay = day.trim().toLowerCase();
  const dayIndex = DAY_ORDER.indexOf(normalizedDay);
  return dayIndex === -1 ? DAY_ORDER.length : dayIndex;
}

function sortPlanTasks<T extends { day: string }>(tasks: T[]) {
  return [...tasks].sort((a, b) => getDayOrder(a.day) - getDayOrder(b.day));
}

function normalizeInspirationKeywords(rawKeyword: string) {
  const cleaned = rawKeyword
    .toLowerCase()
    .replace(/#/g, " ")
    .split(/[,\n;/|]+/)
    .flatMap((chunk) => chunk.split(/\s+/))
    .map((part) => part.trim())
    .filter((part) => part.length >= 3);

  const uniqueKeywords = [...new Set(cleaned)].slice(0, 3);
  return uniqueKeywords.length > 0 ? uniqueKeywords : ["tuto", "conseil"];
}

function normalizeGeneratedTasks(rawTasks: unknown[], wantedCount: number): GeneratedPlanTask[] {
  const valid = rawTasks
    .filter((item): item is Partial<GeneratedPlanTask> => typeof item === "object" && item !== null)
    .map((item) => ({
      day: typeof item.day === "string" ? item.day : "Mardi",
      title: typeof item.title === "string" ? item.title : "Idée vidéo",
      description: typeof item.description === "string" ? item.description : "Description à compléter.",
      objective: typeof item.objective === "string" ? item.objective : "Visibilité",
      hook: typeof item.hook === "string" ? item.hook : "Hook à affiner.",
      script: Array.isArray(item.script)
        ? item.script.filter((line): line is string => typeof line === "string").slice(0, 6)
        : [],
      cta: typeof item.cta === "string" ? item.cta : "Contacte-nous en message privé.",
      format_inspiration:
        typeof item.format_inspiration === "string" && item.format_inspiration.trim().length > 0
          ? normalizeInspirationKeywords(item.format_inspiration).join(", ")
          : "tuto, conseil",
    }));

  if (valid.length === 0) {
    throw new Error("L'IA n'a pas retourné de tâches exploitables.");
  }

  return valid.slice(0, wantedCount);
}

async function getCurrentUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Non authentifié.");
  }

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      businessType: true,
      best_seller: true,
      production_capacity: true,
      city: true,
    },
  });

  if (!profile) {
    throw new Error("Profil utilisateur introuvable.");
  }

  return {
    userId: profile.id,
    businessType: profile.businessType ?? "activité locale",
    bestSeller: profile.best_seller ?? "offre principale",
    productionCapacity: profile.production_capacity ?? "3-4",
    city: profile.city ?? "En ligne",
  };
}

export async function getCurrentWeekPlan() {
  const { userId } = await getCurrentUserProfile();
  const { start, end } = getCurrentWeekRange();

  const plan = await prisma.weeklyPlan.findFirst({
    where: {
      userId,
      startDate: { gte: start },
      endDate: { lte: end },
    },
    include: {
      tasks: true,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!plan) {
    return null;
  }

  return {
    ...plan,
    tasks: sortPlanTasks(plan.tasks),
  };
}

async function createWeekPlan(forceRegenerate = false) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY manquante.");
  }

  const profile = await getCurrentUserProfile();
  const { start, end } = getCurrentWeekRange();

  const existingPlan = await prisma.weeklyPlan.findFirst({
    where: {
      userId: profile.userId,
      startDate: { gte: start },
      endDate: { lte: end },
    },
    include: { tasks: true },
    orderBy: { createdAt: "desc" },
  });

  if (existingPlan) {
    if (!forceRegenerate) {
      return {
        ...existingPlan,
        tasks: sortPlanTasks(existingPlan.tasks),
      };
    }

    await prisma.weeklyPlan.delete({
      where: { id: existingPlan.id },
    });
  }

  const targetCount = inferProductionCount(profile.productionCapacity);
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `Tu es expert en stratégie vidéo courte (TikTok/Reels) pour TPE/PME.
Crée un planning hebdomadaire de ${targetCount} vidéos, réparties sur la semaine.

Contexte business:
- Métier: ${profile.businessType}
- Offre phare: ${profile.bestSeller}
- Ville: ${profile.city}
- Capacité de production: ${profile.productionCapacity}

Contraintes:
1) Retourne EXACTEMENT ${targetCount} idées.
2) Chaque idée doit avoir: day, title, description, objective, hook, script, cta, format_inspiration.
3) "script" = tableau de 3 à 5 phrases courtes.
4) "format_inspiration" = 2 ou 3 hashtags larges et utiles pour rechercher des vidéos similaires, séparés par des virgules (ex: humour, tuto, storytelling).
5) Les jours doivent être variés dans la semaine (pas tous le même jour).
6) Le ton doit être actionnable, concret et orienté résultats.

Retourne UNIQUEMENT un JSON valide sous forme de tableau d'objets.`;

  const response = await withTimeout(
    ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              objective: { type: Type.STRING },
              hook: { type: Type.STRING },
              script: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              cta: { type: Type.STRING },
              format_inspiration: { type: Type.STRING },
            },
            required: ["day", "title", "description", "objective", "hook", "script", "cta", "format_inspiration"],
          },
        },
      },
    }),
    GEMINI_TIMEOUT_MS,
    "Timeout Gemini: réponse trop lente."
  );

  if (!response.text) {
    throw new Error("Réponse IA vide.");
  }

  const parsed = JSON.parse(sanitizeJsonResponse(response.text)) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error("Format JSON invalide: tableau attendu.");
  }

  const tasks = normalizeGeneratedTasks(parsed, targetCount);

  const createdPlan = await prisma.weeklyPlan.create({
    data: {
      userId: profile.userId,
      startDate: start,
      endDate: end,
      tasks: {
        create: tasks.map((task) => ({
          day: task.day,
          title: task.title,
          description: task.description,
          objective: task.objective,
          hook: task.hook,
          script: task.script,
          cta: task.cta,
          format_inspiration: task.format_inspiration,
        })),
      },
    },
    include: { tasks: true },
  });

  revalidatePath("/planificateur");
  return {
    ...createdPlan,
    tasks: sortPlanTasks(createdPlan.tasks),
  };
}

export async function generateWeekPlan() {
  return createWeekPlan(false);
}

export async function regenerateWeekPlan() {
  return createWeekPlan(true);
}

export async function regenerateSingleTask(taskId: string) {
  if (!taskId) {
    throw new Error("taskId manquant.");
  }
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY manquante.");
  }

  const profile = await getCurrentUserProfile();
  const currentTask = await prisma.planTask.findUnique({
    where: { id: taskId },
    include: { weeklyPlan: true },
  });

  if (!currentTask || currentTask.weeklyPlan.userId !== profile.userId) {
    throw new Error("Tâche introuvable ou accès refusé.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `Tu régénères UNE idée vidéo pour ce business:
- Métier: ${profile.businessType}
- Offre phare: ${profile.bestSeller}
- Ville: ${profile.city}

Conserve le même jour de publication: ${currentTask.day}
Évite de reproduire cette ancienne idée:
- Titre: ${currentTask.title}
- Objectif: ${currentTask.objective}
- Format inspiration précédent: ${currentTask.format_inspiration}

Retourne UNIQUEMENT un objet JSON avec:
day, title, description, objective, hook, script, cta, format_inspiration.
Le script doit être un tableau de 3 à 5 phrases courtes.
"format_inspiration" doit contenir 2 ou 3 hashtags larges séparés par des virgules.`;

  const response = await withTimeout(
    ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            objective: { type: Type.STRING },
            hook: { type: Type.STRING },
            script: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            cta: { type: Type.STRING },
            format_inspiration: { type: Type.STRING },
          },
          required: ["day", "title", "description", "objective", "hook", "script", "cta", "format_inspiration"],
        },
      },
    }),
    GEMINI_TIMEOUT_MS,
    "Timeout Gemini: réponse trop lente."
  );

  if (!response.text) {
    throw new Error("Réponse IA vide.");
  }

  const parsed = JSON.parse(sanitizeJsonResponse(response.text)) as unknown;
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Format JSON invalide pour la régénération.");
  }

  const [normalizedTask] = normalizeGeneratedTasks([parsed], 1);
  const updatedTask = await prisma.planTask.update({
    where: { id: taskId },
    data: {
      day: normalizedTask.day || currentTask.day,
      title: normalizedTask.title,
      description: normalizedTask.description,
      objective: normalizedTask.objective,
      hook: normalizedTask.hook,
      script: normalizedTask.script,
      cta: normalizedTask.cta,
      format_inspiration: normalizedTask.format_inspiration,
      status: "pending",
    },
  });

  revalidatePath("/planificateur");
  return updatedTask;
}

export async function togglePlanTaskStatus(taskId: string) {
  if (!taskId) {
    throw new Error("taskId manquant.");
  }

  const profile = await getCurrentUserProfile();
  const task = await prisma.planTask.findUnique({
    where: { id: taskId },
    include: { weeklyPlan: true },
  });

  if (!task || task.weeklyPlan.userId !== profile.userId) {
    throw new Error("Tâche introuvable ou accès refusé.");
  }

  const nextStatus = task.status === "completed" ? "pending" : "completed";
  const updatedTask = await prisma.planTask.update({
    where: { id: taskId },
    data: { status: nextStatus },
  });

  revalidatePath("/planificateur");
  return updatedTask;
}

export async function getInspirationVideos(format_keyword: string) {
  const keywords = normalizeInspirationKeywords(format_keyword);
  if (keywords.length === 0) {
    return [];
  }

  await getCurrentUserProfile();

  return prisma.video.findMany({
    where: {
      OR: keywords.flatMap((keyword) => [
        {
          video_format: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        {
          title: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        {
          tags: {
            some: {
              name: {
                contains: keyword,
                mode: "insensitive",
              },
            },
          },
        },
        {
          vibe: {
            hasSome: [keyword],
          },
        },
      ]),
    },
    select: {
      id: true,
      title: true,
      url: true,
      platform: true,
      views: true,
      likes: true,
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });
}
