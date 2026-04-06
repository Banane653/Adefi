"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { BUSINESS_CATEGORIES, VIBE_TYPES } from "@/lib/constants";

export function FilterHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // On récupère les valeurs actuelles de l'URL pour que les selects restent synchronisés
  const currentCategory = searchParams.get("category") || "";
  const currentVibe = searchParams.get("vibe") || "";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // On repousse l'URL mise à jour sans recharger la page entière
    router.push(`/parcourir?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-4 mb-8 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
      {/* Filtre Catégorie */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Catégorie</label>
        <select 
          value={currentCategory}
          onChange={(e) => updateFilters("category", e.target.value)}
          className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-[150px]"
        >
        <option value="">Toutes les catégories</option>
          {BUSINESS_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Filtre Vibe */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Vibe</label>
        <select 
          value={currentVibe}
          onChange={(e) => updateFilters("vibe", e.target.value)}
          className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-[150px]"
        >
        <option value="">Toutes les vibes</option>
          {VIBE_TYPES.map((vibe) => (
            <option key={vibe.value} value={vibe.value}>{vibe.label}</option>
          ))}
        </select>
      </div>

      {/* Bouton Reset */}
      {(currentCategory || currentVibe) && (
        <button 
          onClick={() => router.push('/parcourir')}
          className="mt-auto mb-1 text-sm text-blue-600 hover:underline"
        >
          Réinitialiser
        </button>
      )}
    </div>
  );
}