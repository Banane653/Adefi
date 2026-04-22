"use server"

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { SITE_URL } from '@/lib/constants'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/admin')
}


export async function signup(formData: FormData) {
    const supabase = await createClient()
  
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }
  
    const { error } = await supabase.auth.signUp(data)
  
    if (error) {
      // Si erreur, on retourne au login
      redirect('/login?error=true') 
    }
  
    // 👇 MODIFICATION ICI : On redirige vers la page d'attente
    redirect('/check-email') 
  }


  export async function signInWithGoogle() {
  const supabase = await createClient()

  // On demande à Supabase de générer l'URL de redirection vers Google
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // Cette URL est celle où Google renverra l'utilisateur APRES la connexion.
      // Il faut la changer par 'http://localhost:3000/auth/callback' en local.
      redirectTo: `${SITE_URL}/auth/confirm`,      
    },
  })

  if (error) {
    redirect('/login?error=google_failed')
  }

  // Si tout est bon, on redirige l'utilisateur vers la page de login Google
  if (data.url) {
    redirect(data.url)
  }
}


