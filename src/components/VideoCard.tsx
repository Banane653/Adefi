import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, ExternalLink } from "lucide-react";

interface VideoCardProps {
  title: string;
  embedUrl: string; // URL de l'iframe
  views: string;
  likes: string;
  tags: { name: string }[];
  platform: "tiktok" | "instagram";
}

export function VideoCard({ title, embedUrl, views, likes, tags, platform }: VideoCardProps) {
  return (
    <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="p-0">
        {/* Container de la vidéo (Format 9:16 pour mobile/vertical) */}
        <div className="aspect-[9/16] w-full bg-zinc-100 dark:bg-zinc-900 relative">
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            scrolling="no"
            allow="encrypted-media"
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <CardTitle className="text-lg font-bold leading-tight mb-2 line-clamp-2">
          {title}
        </CardTitle>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <Badge key={tag.name} variant="secondary" className="text-[10px] uppercase tracking-wider font-bold">
              #{tag.name}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900 mt-2">
        <div className="flex gap-4">
          <div className="flex items-center gap-1 text-zinc-500 text-sm">
            <Eye className="size-4" />
            <span>{views}</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-500 text-sm">
            <Heart className="size-4" />
            <span>{likes}</span>
          </div>
        </div>
        <Badge variant="outline" className="capitalize">
          {platform}
        </Badge>
      </CardFooter>
    </Card>
  );
}