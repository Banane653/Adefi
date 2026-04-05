import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="mins-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <form className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>
        
        <div className="space-y-4">
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            required 
            className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent"
          />
          <input 
            name="password" 
            type="password" 
            placeholder="Mot de passe" 
            required 
            className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent"
          />
          
          <button formAction={login} className="w-full py-3 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 font-bold rounded-xl">
            Se connecter
          </button>
          <button formAction={signup} className="w-full py-3 border border-zinc-200 dark:border-zinc-700 font-medium rounded-xl">
            S'inscrire
          </button>
        </div>
      </form>
    </div>
  )
}