import { completeOnboarding } from "../actions/user";
import { VIBE_TYPES } from "@/lib/constants";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4 py-12">
      <div className="max-w-lg w-full bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Finalisons ton profil 🚀</h1>
          <p className="text-zinc-500 mt-2">Ces informations nous aident à personnaliser ton espace.</p>
        </div>

        <form action={completeOnboarding} className="space-y-5">
          {/* Section Identité */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">Prénom</label>
              <input name="firstName" type="text" required placeholder="Jean" className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">Nom</label>
              <input name="lastName" type="text" required placeholder="Dupont" className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {/* Section Entreprise */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">Nom de l&apos;entreprise</label>
            <input name="companyName" type="text" required placeholder="Ma Super Boîte" className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <hr className="border-zinc-100 dark:border-zinc-800 my-2" />

          {/* 1. SECTEUR D'ACTIVITE & PRODUIT PHARE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                Secteur d&apos;activite
              </label>
              <input
                type="text"
                name="businessType"
                placeholder="Ex: Institut de beaute, Plomberie..."
                required
                className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                Produit ou service le plus vendu
              </label>
              <input
                type="text"
                name="best_seller"
                placeholder="Ex: Renovation de salle de bain, Pose de cils..."
                required
                className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 2. VILLE */}
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
              Ville de l&apos;activite <span className="text-zinc-500 font-normal">(Laisse &quot;En ligne&quot; si applicable)</span>
            </label>
            <input
              type="text"
              name="city"
              placeholder="Ex: Bordeaux (ou En ligne)"
              defaultValue="En ligne"
              required
              className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 3. CAPACITE DE PRODUCTION & NIVEAU DE MONTAGE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                Capacite de production
              </label>
              <select
                name="production_capacity"
                required
                className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Combien de videos par semaine ?</option>
                <option value="1-2">1 a 2 videos (Rythme tranquille)</option>
                <option value="3-4">3 a 4 videos (Rythme recommande)</option>
                <option value="5+">5 videos ou + (Machine de guerre)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                Niveau en montage
              </label>
              <select
                name="editing_level"
                required
                className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choisis ton niveau</option>
                <option value="debutant">Debutant (Je n&apos;y connais rien)</option>
                <option value="intermediaire">Intermediaire (Je sais couper & ajouter du texte)</option>
                <option value="avance">Avance (Je maitrise les effets)</option>
                <option value="sans_montage">Sans montage (1 seule prise)</option>
              </select>
            </div>
          </div>

          {/* 4. NOMBRE DE PERSONNES A LA CAMERA */}
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
              Combien de personnes sont pretes a se filmer ?
            </label>
            <select
              name="camera_people"
              required
              className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selectionne un nombre</option>
              <option value="1">1 personne (Moi uniquement)</option>
              <option value="2-3">2 a 3 personnes (Moi et mon equipe)</option>
              <option value="0">0 (Je veux faire des videos sans montrer mon visage)</option>
            </select>
          </div>

          {/* 5. VIBE */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
              Style de vidéos (Vibe) - <span className="text-zinc-500 font-normal">Choix multiple</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {VIBE_TYPES.map((vibe) => (
                <label 
                  key={vibe.value} 
                  className="cursor-pointer has-[:checked]:bg-blue-600 has-[:checked]:text-white has-[:checked]:border-blue-600 dark:has-[:checked]:bg-blue-600 dark:has-[:checked]:text-white border border-zinc-200 dark:border-zinc-700 rounded-full px-4 py-2 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium text-sm select-none"
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

          <button type="submit" className="w-full py-4 mt-4 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 font-bold rounded-2xl hover:opacity-90 transition-opacity">
            Enregistrer mon profil
          </button>
        </form>
      </div>
    </div>
  );
}