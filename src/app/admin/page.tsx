import { addVideo, deleteVideo } from "../actions/video";
import prisma from "@/lib/prisma";
import DeleteButton from "@/components/DeleteButton"; // Import du bouton

export default async function AdminPage() {
    const existingTags = await prisma.tag.findMany();
    
    // AJOUT : Récupérer les vidéos pour la gestion
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    });

  return (
    <div className="min-h-screen bg-white p-8 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🛠️ Panneau Admin</h1>
        
        <form action={addVideo} className="space-y-6 bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div>
            <label className="block text-sm font-medium mb-2">URL de la vidéo</label>
            <input name="url" type="url" required className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent" placeholder="https://..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Plateforme</label>
              <select name="platform" className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800">
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tags (séparés par des virgules)</label>
              <input name="tags" type="text" className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent" placeholder="tuto, inspiration, tech" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre de vues</label>
              <input name="views" type="number" className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Likes</label>
              <input name="likes" type="number" className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent" placeholder="0" />
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
            Ajouter au Hub
          </button>
        </form>

        <div className="mt-8">
            <h2 className="text-sm font-semibold uppercase text-zinc-500 mb-2">Tags actuellement en base :</h2>
            <div className="flex flex-wrap gap-2">
                {existingTags.map(tag => (
                    <span key={tag.id} className="px-2 py-1 bg-zinc-200 dark:bg-zinc-800 rounded text-xs">
                        {tag.name}
                    </span>
                ))}
            </div>
        </div>
      </div>
    {/* AJOUT : Nouvelle section de gestion des vidéos */}
        <section className="mt-12 space-y-4">
            <h2 className="text-xl font-bold mb-4">📦 Gestion de la bibliothèque ({videos.length})</h2>
            
            <div className="grid gap-3">
                {videos.map((video) => (
                <div 
                    key={video.id} 
                    className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl"
                >
                    <div className="flex flex-col overflow-hidden mr-4">
                    <span className="text-[10px] uppercase font-bold text-zinc-400">{video.platform}</span>
                    <p className="text-sm font-medium truncate text-zinc-600 dark:text-zinc-300">
                        {video.url}
                    </p>
                    </div>

                    {/* Le bouton de suppression qui appelle ton action deleteVideo */}
                    <DeleteButton id={video.id} />
                </div>
                ))}
                
                {videos.length === 0 && (
                <p className="text-zinc-500 text-center py-10 italic">Aucune vidéo en base.</p>
                )}
            </div>
        </section>

    </div>
  );
}