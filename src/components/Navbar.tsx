import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";
import { UserDropdown } from "./UserDropdown";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let dbUser = null;

  // Si l'utilisateur est connecté, on va chercher son prénom dans Prisma
  if (user) {
    dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { firstName: true } // On ne récupère que ce dont on a besoin !
    });
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-black/95 dark:border-zinc-800">
      <div className="flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        
        {/* Le Logo à gauche */}
        <Link href="/feed" className="font-extrabold text-xl tracking-tighter">
          Ade<span className="text-blue-600">Fi</span>
        </Link>

        {/* La zone de droite (Bouton Login OU Menu Déroulant) */}
        <div>
          {user && dbUser ? (
            <UserDropdown firstName={dbUser.firstName} />
          ) : (
            <Link 
              href="/login" 
              className="px-4 py-2 text-sm font-medium bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 dark:bg-white dark:text-black transition-colors"
            >
              Se connecter
            </Link>
          )}
        </div>
        
      </div>
    </nav>
  );
}