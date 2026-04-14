import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { VideoCard } from "@/components/VideoCard";

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 1. Récupérer les infos de l'utilisateur
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser?.businessType) redirect("/onboarding");

  // 2. Récupérer les vidéos filtrées
  // On cherche les vidéos qui ont la MÊME catégorie et la MÊME vibe que l'user
  const videos = await prisma.video.findMany({
    where: {
        category: dbUser?.businessType ?? "", 
        vibe: {
          hasSome: dbUser?.vibe || [], 
        },
    },
    include: {
      tags: true, // On inclut les tags reliés
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Ton Flux Personnalisé ✨
        </h1>
        <p className="text-zinc-500 mt-2">
          Basé sur ton profil : <span className="font-bold text-zinc-900 dark:text-zinc-100">{dbUser.businessType}</span> • <span className="font-bold text-zinc-900 dark:text-zinc-100">{dbUser.vibe?.join(', ')}</span>
        </p>
      </header>

      {videos.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-zinc-200 rounded-3xl">
          <p className="text-zinc-500">Aucune vidéo trouvée pour ton profil pour le moment. On en ajoute bientôt !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {videos.map((video) => (
            <VideoCard
                key={video.id}
                videoId={video.id}
                title={video.title}
                embedUrl={video.url}
                // ✅ Conversion forcée en string car Prisma renvoie des Int (number)
                views={video.views.toString()} 
                likes={video.likes.toString()}
                // ✅ On passe les tags uniquement s'ils existent
                tags={video.tags || []} 
                platform={video.platform as "tiktok" | "instagram"}
            />
            ))}
        </div>
      )}
    </div>
  );
}