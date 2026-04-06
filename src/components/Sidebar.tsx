"use client"; // Obligatoire pour utiliser usePathname

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  // Fonction utilitaire pour vérifier si le lien est actif
  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col fixed h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Ade<span className="text-blue-600">Fi</span>
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {/* LIEN : POUR TOI */}
        <Link
          href="/feed"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
            isActive("/feed")
              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" // Style Actif
              : "text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800" // Style Inactif
          }`}
        >
          <span className="text-xl">✨</span>
          Pour Toi
        </Link>

        {/* LIEN : PARCOURIR */}
        <Link
          href="/parcourir"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
            isActive("/parcourir")
              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
              : "text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
        >
          <span className="text-xl">🔍</span>
          Parcourir
        </Link>
      </nav>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400 text-center">
        v1.0 - Dashboard
      </div>
    </aside>
  );
}