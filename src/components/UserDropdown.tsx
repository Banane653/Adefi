"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// 1. On ajoute isAdmin dans l'interface des props
export function UserDropdown({ 
  firstName, 
  isAdmin 
}: { 
  firstName: string | null;
  isAdmin: boolean; 
}) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); 
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full font-semibold">
          {firstName ? `Salut, ${firstName}` : "Mon Profil"}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
        
        {/* 2. Affichage conditionnel : Uniquement pour les admins */}
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => router.push("/admin")} 
              className="cursor-pointer font-bold text-blue-600 focus:text-blue-700 focus:bg-blue-50 dark:focus:bg-blue-950"
            >
              Panneau Admin
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => router.push("/dashboard")} className="cursor-pointer">
          Dashboard
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push("/feed")} className="cursor-pointer">
          Mon feed
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => router.push("/profil")} className="cursor-pointer">
          Modifier mon profil
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 font-medium cursor-pointer focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950">
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}