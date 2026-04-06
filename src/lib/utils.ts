import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getEmbedUrl(url: string): { embedUrl: string; platform: "tiktok" | "instagram" | "unknown" } {
  // Nettoyage de l'URL (enlever les espaces et paramètres de tracking)
  const cleanUrl = url.split('?')[0].trim();

  // Cas TIKTOK
  if (cleanUrl.includes("tiktok.com")) {
    // Format attendu : https://www.tiktok.com/@user/video/73456789...
    const videoIdMatch = cleanUrl.match(/\/video\/(\d+)/);
    if (videoIdMatch && videoIdMatch[1]) {
      return {
        embedUrl: `https://www.tiktok.com/embed/v2/${videoIdMatch[1]}`,
        platform: "tiktok"
      };
    }
  }

  // Cas INSTAGRAM
  if (cleanUrl.includes("instagram.com")) {
    // Formats : /reels/ABC123... ou /p/ABC123...
    const reelMatch = cleanUrl.match(/\/(reels|p)\/([^/]+)/);
    if (reelMatch && reelMatch[2]) {
      return {
        embedUrl: `https://www.instagram.com/reels/${reelMatch[2]}/embed`,
        platform: "instagram"
      };
    }
  }

  return { embedUrl: url, platform: "unknown" };
}