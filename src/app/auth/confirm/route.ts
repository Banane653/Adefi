import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  // Si on reçoit bien le jeton de sécurité depuis le mail
  if (token_hash && type) {
    const supabase = await createClient()

    // On valide le compte !
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    // Si tout est bon, on redirige vers le tableau de bord
    if (!error) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  // S'il y a une erreur (lien expiré par ex), on le renvoie au login
  return NextResponse.redirect(new URL('/login?error=Lien invalide ou expiré', request.url))
}