import { Sidebar } from "@/components/Sidebar"; // Vérifie bien le chemin d'import
import { ReactNode } from "react";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      
      {/* On appelle notre nouveau composant ici */}
      <Sidebar />

      {/* Contenu principal décalé vers la droite pour laisser place à la Sidebar */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>

    </div>
  );
}