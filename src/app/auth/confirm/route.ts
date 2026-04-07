import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma' 
import { ADMIN_EMAILS } from '@/lib/constants' // 👈 Importe la liste


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  // Si on reçoit bien le jeton de sécurité depuis le mail
  if (token_hash && type) {
    const supabase = await createClient()

    // 1. On valide le compte et on connecte l'utilisateur côté serveur !
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    // 2. Si la vérification a réussi
    if (!error) {
      // On récupère les infos de l'utilisateur fraîchement connecté
      const { data: { user } } = await supabase.auth.getUser()

      if (user?.email) {
        // 3. On va chercher son profil dans ta base de données Prisma
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email }
        })

        // 4. Redirections Intelligentes
        // Si c'est un compte admin (assure-toi d'avoir une colonne 'role' ou utilise ton adresse mail en dur)
        if (ADMIN_EMAILS.includes(user.email)) {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
        // Sinon, c'est un client régulier
        else {
          return NextResponse.redirect(new URL('/feed', request.url))
        }
      }
    }
  }

  // S'il y a une erreur (lien expiré par ex), on le renvoie au login avec un message
  return NextResponse.redirect(new URL('/login?error=Lien invalide ou expiré', request.url))
}