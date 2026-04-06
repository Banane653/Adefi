import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Video, Sparkles, Target } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative isolate">
      {/* Background décoratif (Optionnel mais stylé) */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>

      {/* SECTION HERO */}
      <section className="mx-auto max-w-4xl py-24 sm:py-32 px-6">
        <div className="text-center">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-8 dark:bg-blue-900/30 dark:text-blue-400">
            Nouveau : Propulsé par l'IA ⚡️
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 sm:text-7xl dark:text-white">
            Trouvez les vidéos qui <span className="text-blue-600">cartonnent</span> pour votre commerce.
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Arrêtez de deviner. Obtenez des idées de contenus personnalisées selon votre secteur et votre "vibe" pour attirer plus de clients sur TikTok et Instagram.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/login">
              <Button size="lg" className="rounded-full px-8 text-md font-semibold gap-2 shadow-lg hover:shadow-blue-500/20 transition-all">
                Commencer gratuitement <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="#features" className="text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100">
              Voir comment ça marche <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION PETITS POINTS FORTS (Grille rapide) */}
      <section id="features" className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-blue-500/20 shadow-lg">
                <Target className="size-6" />
              </div>
              <h3 className="text-lg font-bold">Ultra-Ciblé</h3>
              <p className="mt-2 text-zinc-500">Des idées adaptées à votre métier : du resto au salon de coiffure.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white shadow-purple-500/20 shadow-lg">
                <Sparkles className="size-6" />
              </div>
              <h3 className="text-lg font-bold">Zéro Panne d'Inspiration</h3>
              <p className="mt-2 text-zinc-500">Un flux constant de tendances décortiquées pour vous.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600 text-white shadow-orange-500/20 shadow-lg">
                <Video className="size-6" />
              </div>
              <h3 className="text-lg font-bold">Prêt à Filmer</h3>
              <p className="mt-2 text-zinc-500">Scripts et exemples visuels inclus pour chaque recommandation.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}