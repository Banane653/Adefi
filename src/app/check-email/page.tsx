export default function CheckEmailPage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 w-full max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold">✉️ Vérifie ta boîte mail</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Nous t'avons envoyé un lien de confirmation. 
            Clique dessus pour activer ton compte.
          </p>
          <p className="text-sm text-zinc-500">
            (N'oublie pas de vérifier tes spams au cas où !)
          </p>
        </div>
      </div>
    );
  }