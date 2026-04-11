import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, ExternalLink, Sparkles, TrendingUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface VideoCardProps {
  title: string;
  embedUrl: string;
  views: string;
  likes: string;
  tags: { name: string }[];
  platform: "tiktok" | "instagram";
}

export function VideoCard({ title, embedUrl, views, likes, tags, platform }: VideoCardProps) {
  const cleanUrl = embedUrl.replace('/embed', '').replace('/v2', '');

  return (
    <Dialog>
      {/* ========================================== */}
      {/* 1. LA PETITE CARTE (VUE MINIATURE/DASHBOARD) */}
      {/* ========================================== */}
      <Card className="group relative overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm hover:shadow-md transition-all flex flex-col h-full hover:border-blue-500/50">
        
        {/* LE BOUTON FANTÔME : C'est lui qui ouvre la modale sans casser le HTML */}
        {/* On n'utilise PLUS asChild ici, on laisse Radix créer un vrai <button> */}
        <DialogTrigger className="absolute inset-0 z-20 w-full h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" aria-label={`Voir les détails de ${title}`}>
          <span className="sr-only">Ouvrir</span>
        </DialogTrigger>

        <CardHeader className="p-0">
          <div className="aspect-[9/16] w-full bg-zinc-100 dark:bg-zinc-900 relative overflow-hidden">
            {/* J'ai gardé pointer-events-none pour que le clic passe à travers jusqu'au bouton fantôme */}
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full border-none pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity"
              scrolling="no"
              title={`Miniature ${title}`}
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-3 flex-grow relative z-10 pointer-events-none">
          <CardTitle className="text-sm font-bold leading-tight mb-2 line-clamp-2">
            {title}
          </CardTitle>
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag.name} variant="secondary" className="text-[9px] px-1.5 py-0 uppercase tracking-wider font-bold">
                #{tag.name}
              </Badge>
            ))}
            {tags.length > 3 && <span className="text-[10px] text-zinc-500 font-medium">+{tags.length - 3}</span>}
          </div>
        </CardContent>

        <CardFooter className="p-3 pt-0 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900 mt-auto bg-zinc-50/50 dark:bg-zinc-900/50 relative z-10 pointer-events-none">
          <div className="flex gap-3">
            <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400 text-xs font-medium">
              <Eye className="size-3.5" />
              <span>{views}</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400 text-xs font-medium">
              <Heart className="size-3.5" />
              <span>{likes}</span>
            </div>
          </div>
          <Badge variant="outline" className="capitalize text-[10px] px-1.5 py-0">
            {platform}
          </Badge>
        </CardFooter>
      </Card>

      {/* ========================================== */}
      {/* 2. LA FENÊTRE MODALE (VUE DÉTAILLÉE HORIZONTALE) */}
      {/* ========================================== */}
      <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[1100px] h-[90vh] md:h-[80vh] p-0 overflow-hidden flex flex-col md:flex-row bg-white dark:bg-zinc-950 gap-0">
        
        {/* PARTIE GAUCHE : LA VIDÉO (Jouable) */}
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

        {/* PARTIE DROITE : LES INFOS & ANALYSES */}
        <div className="w-full md:w-3/5 h-full overflow-y-auto p-6 md:p-8 flex flex-col gap-8">
          
          {/* En-tête de la modale */}
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
                <span>Voir l'original</span>
                <ExternalLink className="size-4" />
              </a>
            </div>
            <DialogTitle className="text-2xl font-bold leading-tight mb-2 text-zinc-900 dark:text-white">
              {title}
            </DialogTitle>

            {/* Description invisible visuellement (sr-only) mais lue par les navigateurs pour retirer l'erreur */}
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

          {/* Statistiques clés */}
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

          {/* L'espace IA (Pour ta future mise à jour) */}
          <div className="mt-auto p-6 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col items-center justify-center text-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full text-blue-600 dark:text-blue-400">
              <Sparkles className="size-6" />
            </div>
            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Adapter cette vidéo à ton business</h3>
            <p className="text-sm text-zinc-500 max-w-sm mb-2">
              Bientôt : Notre IA générera un script sur-mesure étape par étape pour recréer cette vidéo dans ton établissement.
            </p>
            <button disabled className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium opacity-50 cursor-not-allowed text-sm">
              Générer le script IA (Prochainement)
            </button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}