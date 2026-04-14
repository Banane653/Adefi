import { addVideo } from "../actions/video";
import prisma from "@/lib/prisma";
import DeleteButton from "@/components/DeleteButton"; // Import du bouton
import { BUSINESS_CATEGORIES, VIBE_TYPES } from "@/lib/constants";

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
        
        <form action={addVideo} className="space-y-6 bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
  
        {/* CHAMP TITRE (Obligatoire pour Prisma) */}
        <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Titre de la vidéo</label>
            <input 
            name="title" 
            type="text" 
            required 
            className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            placeholder="Ex: 3 astuces pour doubler vos vues" 
            />
        </div>

        {/* CHAMP URL (Sert à détecter la plateforme + embed) */}
        <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">URL de la vidéo (TikTok ou Instagram)</label>
            <input 
            name="url" 
            type="url" 
            required 
            className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            placeholder="https://www.tiktok.com/@user/video/..." 
            />
            <p className="mt-1 text-xs text-zinc-500 italic">La plateforme est détectée automatiquement.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
            {/* CATÉGORIE (Doit matcher avec tes choix d'onboarding) */}
            <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Catégorie cible</label>
            <select name="category" required className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800">
                {BUSINESS_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                    {cat.label}
                </option>
                ))}
            </select>
            </div>

            {/* VIBE */}
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                Vibes du contenu
              </label>
              <div className="flex flex-wrap gap-2">
                {VIBE_TYPES.map((vibe) => (
                  <label 
                    key={vibe.value} 
                    className="cursor-pointer has-[:checked]:bg-zinc-900 has-[:checked]:text-white dark:has-[:checked]:bg-white dark:has-[:checked]:text-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-full px-3 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium text-sm select-none"
                  >
                    <input 
                      type="checkbox" 
                      name="vibe" 
                      value={vibe.value} 
                      className="hidden" 
                    />
                    {vibe.label}
                  </label>
                ))}
              </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
              Niveau de difficulte
            </label>
            <select name="difficulty" required className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800">
              <option value="">Selectionne un niveau</option>
              <option value="debutant">Debutant (1 seul plan, pas de texte complexe)</option>
              <option value="intermediaire">Intermediaire (cut ou texte)</option>
              <option value="avance">Avance (transitions, rythme rapide, effets)</option>
              <option value="sans_montage">Sans montage</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
              Objectif business
            </label>
            <select name="business_goal" required className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800">
              <option value="">Selectionne un objectif</option>
              <option value="visibilite">Visibilite / Viralite</option>
              <option value="expertise">Expertise / Confiance</option>
              <option value="conversion">Conversion / Vente</option>
              <option value="preuve_sociale">Preuve sociale</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
            Presence humaine
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <label className="flex items-center gap-2 p-3 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 cursor-pointer">
              <input type="radio" name="camera_presence" value="face_cam" required />
              <span className="text-sm">Face camera</span>
            </label>
            <label className="flex items-center gap-2 p-3 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 cursor-pointer">
              <input type="radio" name="camera_presence" value="multi" required />
              <span className="text-sm">Multi-personnes</span>
            </label>
            <label className="flex items-center gap-2 p-3 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 cursor-pointer">
              <input type="radio" name="camera_presence" value="b_roll" required />
              <span className="text-sm">B-Roll / Voix-off</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
              Ciblage sectoriel
            </label>
            <select name="sector_scope" required className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800">
              <option value="">Selectionne le ciblage</option>
              <option value="generic">Generique / Adaptable</option>
              <option value="specific">Specifique</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
              Secteurs compatibles (si specifique)
            </label>
            <input
              name="compatible_sectors"
              type="text"
              placeholder="Ex: Beaute, Restauration"
              className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
            Format de la video
          </label>
          <select name="video_format" required className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800">
            <option value="">Selectionne un format</option>
            <option value="decouverte_metier">Decouverte metier</option>
            <option value="tuto_conseil">Tuto / Conseil</option>
            <option value="avant_apres">Avant / Apres</option>
            <option value="trend_tiktok">Trend TikTok</option>
            <option value="storytime">Storytime</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {/* TAGS (Gestion simplifiée) */}
            <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Tags (séparés par des virgules)</label>
            <input 
                name="tags" 
                type="text" 
                className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="tuto, inspiration, coulisses" 
            />
            {/* Sélecteur de type caché ou visible selon tes besoins, ici on peut forcer NICHE par défaut si tu veux */}
            <input type="hidden" name="tagType" value="NICHE" />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Vues réelles</label>
            <input name="views" type="number" className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800" placeholder="0" />
            </div>
            <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Likes réels</label>
            <input name="likes" type="number" className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800" placeholder="0" />
            </div>
        </div>

        <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]">
            Ajouter au Hub ✨
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