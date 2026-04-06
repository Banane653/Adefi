import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adefi - Automatisation Vidéo",
  description: "Générez des idées de vidéos adaptées à votre entreprise",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={cn(
        "h-full", 
        "antialiased", 
        geistSans.variable, 
        geistMono.variable, 
        jetbrainsMono.variable
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-white dark:bg-black text-zinc-900 dark:text-zinc-50">
        {/* La Navbar s'affichera sur toutes les pages */}
        <Navbar />

        {/* Le contenu de tes pages s'affiche ici */}
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}