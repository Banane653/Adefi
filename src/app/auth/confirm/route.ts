import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma' 
import { ADMIN_EMAILS } from '@/lib/constants'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // Paramètres pour Email classique
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  
  // Paramètre pour Google OAuth
  const code = searchParams.get('code')

  // On initialise Supabase
  const supabase = await createClient()
  let authError = null;

  // 1. On valide la connexion selon le fournisseur (Email ou Google)
  if (code) {
    // Si on a un 'code', c'est que l'utilisateur revient de Google
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    authError = error
  } else if (token_hash && type) {
    // Si on a un 'token_hash', c'est que l'utilisateur a cliqué sur un lien par e-mail
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    authError = error
  } else {
    // S'il n'y a ni code ni token, on rejette
    return NextResponse.redirect(new URL('/login?error=Lien invalide ou expiré', request.url))
  }

  // 2. Si la vérification a réussi (Google ou Email)
  if (!authError) {
    // On récupère les infos de l'utilisateur fraîchement connecté
    const { data: { user } } = await supabase.auth.getUser()

    if (user?.email) {
      // 3. On va chercher son profil dans ta base de données Prisma
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email }
      })

      // 4. Redirections Intelligentes
      // Si c'est un compte admin
      if (ADMIN_EMAILS.includes(user.email)) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      // Sinon, c'est un client régulier
      else {
        return NextResponse.redirect(new URL('/feed', request.url))
      }
    }
  }

  // S'il y a une erreur (lien expiré, annulation Google, etc.), on le renvoie au login
  return NextResponse.redirect(new URL('/login?error=Erreur_d_authentification', request.url))
}