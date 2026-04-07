import { completeOnboarding } from "../actions/user";
import { BUSINESS_CATEGORIES, VIBE_TYPES } from "@/lib/constants";

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
            <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">Nom de l'entreprise</label>
            <input name="companyName" type="text" required placeholder="Ma Super Boîte" className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <hr className="border-zinc-100 dark:border-zinc-800 my-2" />

          {/* Section Métier */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">
              Secteur d'activité
            </label>
            <select 
              name="businessType" 
              required 
              className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionne...</option>
              {BUSINESS_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Section Vibe */}
          <div>
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