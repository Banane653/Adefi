import prisma from "@/lib/prisma";
import { addVideo } from "./actions/video";

console.log("Ma DATABASE_URL est :", process.env.DATABASE_URL ? "Trouvée ✅" : "Vide ❌");

export default async function Home() {
  // On récupère les vidéos directement depuis Supabase via Prisma
  const videos = await prisma.video.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans text-zinc-950 dark:text-zinc-50">
      <main className="max-w-4xl mx-auto py-20 px-6">
        
        {/* Header */}
        <div className="mb-12 text-center sm:text-left">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Curator Video Hub 🎥
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Enregistrez vos meilleures trouvailles TikTok et Instagram.
          </p>
        </div>

        {/* Formulaire d'ajout rapide */}
        <section className="mb-16 p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500 mb-4">
            Ajouter une pépite
          </h2>
          {/* On passe directement addVideo, Next.js s'occupe de lier le formData automatiquement */}
          <form 
            action={addVideo} // 👈 PASSE LA FONCTION DIRECTEMENT ICI
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              name="url"
              type="url"
              placeholder="Collez l'URL (TikTok, Insta...)"
              required
              className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select 
              name="platform" 
              className="px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
            >
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
            </select>
            <button
              type="submit"
              className="px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 font-medium rounded-xl hover:opacity-90 transition-opacity"
            >
              Enregistrer
            </button>
          </form>
        </section>

        {/* Liste des vidéos */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Ma Bibliothèque</h2>
          <div className="grid gap-4">
            {videos.length === 0 && (
              <p className="text-zinc-500 italic">Aucune vidéo enregistrée pour le moment...</p>
            )}
            {videos.map((video) => (
              <div 
                key={video.id} 
                className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm"
              >
                <div className="overflow-hidden">
                  <p className="font-medium truncate max-w-[250px] sm:max-w-md">
                    {video.url}
                  </p>
                  <span className="text-xs text-zinc-400 uppercase font-bold">
                    {video.platform}
                  </span>
                </div>
                <div className="text-right text-xs text-zinc-400">
                  {new Date(video.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}