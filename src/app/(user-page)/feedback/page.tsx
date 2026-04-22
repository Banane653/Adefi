"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageSquarePlus, Loader2 } from "lucide-react";
import { submitFeedback } from "@/app/actions/feedback"; // Adapte le chemin si besoin

export default function FeedbackPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    
    // Appel de notre Server Action
    const result = await submitFeedback(formData);

    if (result.success) {
      setIsSuccess(true);
    } else {
      setErrorMessage(result.error || "Une erreur est survenue.");
    }
    
    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
          <CardContent className="pt-6 pb-8 flex flex-col items-center">
            <CheckCircle2 className="size-16 text-green-500 mb-4" />
            <CardTitle className="text-2xl mb-2 text-green-700 dark:text-green-400">Merci beaucoup !</CardTitle>
            <CardDescription className="text-base text-green-600/80 dark:text-green-500/80">
              Ton retour a bien été envoyé. C'est grâce à toi que nous améliorons l'outil chaque jour.
            </CardDescription>
            <Button 
              variant="outline" 
              className="mt-6 border-green-300 text-green-700 hover:bg-green-100"
              onClick={() => setIsSuccess(false)}
            >
              Envoyer un autre retour
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-3">
          <MessageSquarePlus className="size-8 text-blue-600" />
          Vos retours (Beta)
        </h1>
        <p className="text-zinc-500 mt-2">
          Un bug ? Une idée de génie ? Quelque chose de frustrant ? Dis-nous tout. 
          Nous lisons 100% des messages.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* CATÉGORIE */}
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                De quoi s'agit-il ?
              </label>
              <select 
                id="category" 
                name="category" 
                required
                className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="bug">🐛 J'ai trouvé un bug</option>
                <option value="feature">💡 Idée de fonctionnalité</option>
                <option value="improvement">✨ Amélioration d'une page</option>
                <option value="other">💬 Autre chose</option>
              </select>
            </div>

            {/* MESSAGE */}
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Ton message détaillé
              </label>
              <textarea 
                id="content" 
                name="content" 
                rows={5}
                required
                placeholder="Explique-nous le problème ou ton idée en détail..."
                className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              />
            </div>

            {/* IMAGE (Esthétique pour l'instant) */}
            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                Capture d'écran <span className="text-xs font-normal text-zinc-400">(Optionnel)</span>
              </label>
              <input 
                type="file" 
                id="image" 
                name="image" 
                accept="image/*"
                className="w-full p-2 text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>

            {/* ERREUR */}
            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

            {/* BOUTON SOUMETTRE */}
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-5 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Envoyer le retour"
              )}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}