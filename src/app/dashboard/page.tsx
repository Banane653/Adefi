import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // 1. On initialise le client Supabase
  const supabase = await createClient();
  
  // 2. On récupère l'utilisateur connecté (C'EST ÇA QUI MANQUAIT)
  const { data: { user } } = await supabase.auth.getUser();

  // 3. Si pas d'utilisateur, retour au login
  if (!user) {
    redirect("/login");
  }

  // 4. On cherche l'utilisateur dans notre base de données Prisma
  const dbUser = await prisma.user.findUnique({ 
    where: { id: user.id } 
  });

  // 5. Si l'utilisateur n'a pas encore fait son onboarding, on le force à y aller
  if (!dbUser || !dbUser.businessType) {
    redirect("/onboarding");
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Bienvenue, {dbUser.firstName} 👋
        </h1>
        <p className="text-zinc-500 text-lg mt-2">
          Voici les meilleures idées de vidéos pour <span className="text-blue-600 font-semibold">{dbUser.companyName}</span>.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-transparent dark:border-zinc-800">
          <p className="text-sm text-zinc-500 uppercase font-bold tracking-wider italic">Ton Secteur</p>
          <p className="text-xl font-medium">{dbUser.businessType}</p>
        </div>
        <div className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-transparent dark:border-zinc-800">
          <p className="text-sm text-zinc-500 uppercase font-bold tracking-wider italic">Ta Vibe</p>
          <p className="text-xl font-medium">{dbUser.vibe}</p>
        </div>
      </div>

      {/* C'est ici qu'on affichera les vidéos plus tard */}
    </div>
  );
}