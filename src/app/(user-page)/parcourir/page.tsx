import prisma from "@/lib/prisma";
import { VideoCard } from "@/components/VideoCard";
import { FilterHeader } from "@/components/FilterHeader";

export default async function ParcourirPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; vibe?: string }>;
}) {
  // On attend les paramètres de recherche (obligatoire en Next.js 15)
  const { category, vibe } = await searchParams;

  // On construit l'objet de filtrage dynamiquement
  const whereClause: any = {};
  if (category) whereClause.category = category;
  if (vibe) whereClause.vibe = { has: vibe };

  // Requête Prisma
  const videos = await prisma.video.findMany({
    where: whereClause,
    include: {
      tags: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Parcourir la bibliothèque 🔍</h1>
        <p className="text-zinc-500">Explorez toutes les pépites, peu importe votre niche.</p>
      </header>

      {/* Barre de filtres */}
      <FilterHeader />

      {/* Grille de vidéos */}
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              title={video.title}
              embedUrl={video.url}
              views={video.views.toString()}
              likes={video.likes.toString()}
              tags={video.tags}
              platform={video.platform as "tiktok" | "instagram"}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-100 dark:bg-zinc-900 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-500">Aucune vidéo ne correspond à ces critères... 🧊</p>
        </div>
      )}
    </div>
  );
}