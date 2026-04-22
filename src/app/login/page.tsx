import { login, signup, signInWithGoogle } from './actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>
        
        {/* Formulaire classique (Email / Mot de passe) */}
        <form className="space-y-4">
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            required 
            className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
          <input 
            name="password" 
            type="password" 
            placeholder="Mot de passe" 
            required 
            className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
          
          <button formAction={login} className="w-full py-3 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 font-bold rounded-xl hover:opacity-90 transition-opacity">
            Se connecter
          </button>
          <button formAction={signup} className="w-full py-3 border border-zinc-200 dark:border-zinc-700 font-medium rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            S'inscrire
          </button>
        </form>

        {/* Séparateur visuel */}
        <div className="my-6 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-zinc-200 dark:before:border-zinc-700 after:mt-0.5 after:flex-1 after:border-t after:border-zinc-200 dark:after:border-zinc-700">
          <p className="mx-4 mb-0 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">Ou</p>
        </div>

        {/* Bouton Google */}
        <form action={signInWithGoogle}>
          <button className="w-full flex justify-center items-center gap-3 py-3 border border-zinc-200 dark:border-zinc-700 font-medium rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            {/* Icône Google SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continuer avec Google
          </button>
        </form>
      </div>
    </div>
  )
}