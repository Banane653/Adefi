"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, ExternalLink, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { generateVideoScript } from "@/app/actions/ai";

interface VideoCardProps {
  videoId: string;
  title: string;
  embedUrl: string;
  views: string;
  likes: string;
  tags: { name: string }[];
  platform: "tiktok" | "instagram";
}

type AiScript = {
  hook: string;
  script: string[];
  cta: string;
};

export function VideoCard({ videoId, title, embedUrl, views, likes, tags, platform }: VideoCardProps) {
  const cleanUrl = embedUrl.replace('/embed', '').replace('/v2', '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiScript, setAiScript] = useState<AiScript | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleGenerateScript = async (forceRegenerate = false) => {
    try {
      setIsGenerating(true);
      setAiError(null);
      const result = await generateVideoScript(videoId, title, tags.map((tag) => tag.name), forceRegenerate);
      setAiScript(result);
    } catch (error) {
      console.error("Erreur génération IA:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue pendant la génération. Réessaie dans un instant.";
      setAiError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog>
      {/* ========================================== */}
      {/* 1. LA PETITE CARTE (VUE MINIATURE COMPACTE) */}
      {/* ========================================== */}
      <Card className="group relative overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm hover:shadow-md transition-all flex flex-col h-full hover:border-blue-500/50">
        
        <DialogTrigger className="absolute inset-0 z-20 w-full h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" aria-label={`Voir les détails de ${title}`}>
          <span className="sr-only">Ouvrir</span>
        </DialogTrigger>

        <CardHeader className="p-0">
          {/* CHANGEMENT ICI : aspect-square (1:1) et fond noir pour les bandes */}
          <div className="aspect-square w-full bg-black relative overflow-hidden">
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full border-none pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity"
              scrolling="no"
              title={`Miniature ${title}`}
            />
          </div>
        </CardHeader>
        
        {/* CHANGEMENT ICI : p-2 au lieu de p-3 pour tasser la carte */}
        <CardContent className="p-2 flex-grow relative z-10 pointer-events-none">
          <CardTitle className="text-xs font-bold leading-tight mb-1.5 line-clamp-2">
            {title}
          </CardTitle>
          <div className="flex flex-wrap gap-1">
            {/* CHANGEMENT ICI : On limite à 2 tags maximum pour gagner de la hauteur */}
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag.name} variant="secondary" className="text-[8px] px-1 py-0 uppercase tracking-wider font-bold">
                #{tag.name}
              </Badge>
            ))}
            {tags.length > 2 && <span className="text-[9px] text-zinc-500 font-medium">+{tags.length - 2}</span>}
          </div>
        </CardContent>

        <CardFooter className="p-2 pt-0 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900 mt-auto bg-zinc-50/50 dark:bg-zinc-900/50 relative z-10 pointer-events-none">
          <div className="flex gap-2">
            <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400 text-[10px] font-medium">
              <Eye className="size-3" />
              <span>{views}</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400 text-[10px] font-medium">
              <Heart className="size-3" />
              <span>{likes}</span>
            </div>
          </div>
          <Badge variant="outline" className="capitalize text-[8px] px-1 py-0 border-zinc-300 dark:border-zinc-700">
            {platform}
          </Badge>
        </CardFooter>
      </Card>

      {/* ========================================== */}
      {/* 2. LA FENÊTRE MODALE (VUE DÉTAILLÉE HORIZONTALE) */}
      {/* Le code de la modale reste strictement identique */}
      {/* ========================================== */}
      <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[1100px] h-[90vh] md:h-[80vh] p-0 overflow-hidden flex flex-col md:flex-row bg-white dark:bg-zinc-950 gap-0">
        
        <div className="w-full md:w-2/5 bg-zinc-100 dark:bg-zinc-900 h-[40vh] md:h-full flex items-center justify-center p-4 md:p-8 relative border-r border-zinc-200 dark:border-zinc-800">
          <div className="aspect-[9/16] w-full max-w-[320px] h-full relative rounded-2xl overflow-hidden shadow-2xl bg-black">
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full border-none"
              allowFullScreen
              scrolling="no"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              sandbox="allow-scripts allow-same-origin allow-popups"
              title={`Vidéo ${platform} - ${title}`}
            />
          </div>
        </div>

        <div className="w-full md:w-3/5 h-full overflow-y-auto p-6 md:p-8 flex flex-col gap-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="capitalize border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:bg-blue-950/50">
                {platform}
              </Badge>
              <a 
                href={cleanUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <span>Voir l&apos;original</span>
                <ExternalLink className="size-4" />
              </a>
            </div>
            <DialogTitle className="text-2xl font-bold leading-tight mb-2 text-zinc-900 dark:text-white">
              {title}
            </DialogTitle>

            <DialogDescription className="sr-only">
              Statistiques et informations détaillées pour la vidéo {title} provenant de {platform}.
            </DialogDescription>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag.name} variant="secondary" className="uppercase tracking-wider font-bold">
                  #{tag.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-zinc-500 mb-1">
                <Eye className="size-4" />
                <span className="text-sm font-medium">Vues estimées</span>
              </div>
              <span className="text-2xl font-black">{views}</span>
            </div>
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-zinc-500 mb-1">
                <Heart className="size-4" />
                <span className="text-sm font-medium">Likes</span>
              </div>
              <span className="text-2xl font-black">{likes}</span>
            </div>
          </div>

          <div className="mt-auto p-6 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full text-blue-600 dark:text-blue-400 w-fit">
              <Sparkles className="size-6" />
            </div>
            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Adapter cette vidéo à ton business</h3>

            {!aiScript ? (
              <p className="text-sm text-zinc-500">
                Génère un script sur-mesure en fonction de ton activité, de ta ville et de ton offre.
              </p>
            ) : (
              <div className="w-full space-y-4 text-left">
                <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-100/70 dark:bg-blue-900/30 p-4">
                  <p className="text-xs uppercase tracking-wider font-semibold text-blue-700 dark:text-blue-300 mb-1">Hook</p>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">{aiScript.hook}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-zinc-500 mb-2">Script</p>
                  <ol className="list-decimal pl-5 space-y-1 text-sm text-zinc-700 dark:text-zinc-200">
                    {aiScript.script.map((line, index) => (
                      <li key={`${line}-${index}`}>{line}</li>
                    ))}
                  </ol>
                </div>

                <p className="text-sm text-zinc-900 dark:text-zinc-100">
                  <strong>CTA :</strong> {aiScript.cta}
                </p>
              </div>
            )}

            {aiError && (
              <p className="text-sm text-red-600 dark:text-red-400">{aiError}</p>
            )}

            <button
              type="button"
              onClick={() => handleGenerateScript(false)}
              disabled={isGenerating}
              className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed w-fit transition-colors"
            >
              {isGenerating ? "Génération en cours..." : aiScript ? "Recharger le script sauvegardé" : "Générer le script IA"}
            </button>
            {aiScript && (
              <button
                type="button"
                onClick={() => handleGenerateScript(true)}
                disabled={isGenerating}
                className="px-6 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed w-fit hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                {isGenerating ? "Régénération..." : "Régénérer un nouveau script"}
              </button>
            )}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}