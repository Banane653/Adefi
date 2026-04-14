"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Target, Play, CheckCircle2, ArrowRight, RefreshCw, Eye, Heart } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// ==========================================
// 1. DONNÉES HARDCODÉES (Pour le MVP visuel)
// ==========================================
const WEEKLY_PLAN = {
  startDate: "Lundi 15 Avril",
  endDate: "Dimanche 21 Avril",
  businessName: "Salon Clara Beauty",
  tasks: [
    {
      id: "t1",
      day: "Mardi",
      type: "Découverte métier",
      objective: "Expertise / Confiance",
      status: "pending", // 'pending' ou 'completed'
      details: {
        title: "Une intervention que les gens sous-estiment (et qui coûte cher)",
        hook: "Si tu fais ça toute seule à la maison, tu risques d'abîmer ta plaque pour 6 mois...",
        script: [
          "Beaucoup de clientes essaient de retirer leur semi-permanent elles-mêmes en grattant.",
          "Grosse erreur : ça arrache les couches supérieures de l'ongle naturel.",
          "Résultat : des ongles mous, douloureux, et le prochain vernis ne tiendra pas.",
          "Voici la bonne méthode douce que j'utilise au salon avec ce produit spécifique."
        ],
        cta: "Prends RDV pour ta prochaine dépose en toute sécurité (lien en bio) 💅",
        difficulty: "Facile",
        duration: "20 - 30 sec",
        format: "Face caméra + Plan serré sur les mains",
        inspiration: [
          { id: "v1", title: "Erreur dépose gel", views: "45K", likes: "1.2K", img: "https://images.unsplash.com/photo-1519014816548-bf5fe459e98b?w=400&q=80" },
          { id: "v2", title: "Pourquoi aller en salon", views: "12K", likes: "800", img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&q=80" }
        ]
      }
    },
    {
      id: "t2",
      day: "Jeudi",
      type: "Avant / Après",
      objective: "Conversion",
      status: "pending",
      details: {
        title: "Transformation incroyable : Rattrapage d'ongles rongés",
        hook: "Tu penses que tes ongles sont irrécupérables ? Regarde ce qu'on a fait aujourd'hui.",
        script: [
          "Ma cliente du jour ronge ses ongles depuis 10 ans.",
          "On a commencé par un nettoyage minutieux des cuticules.",
          "Puis j'ai utilisé une technique de chablon pour créer une extension naturelle.",
          "Regardez ce résultat ! Elle n'en revenait pas."
        ],
        cta: "Envoie-moi une photo de tes ongles en DM, on va trouver une solution ! ✨",
        difficulty: "Moyen",
        duration: "15 - 20 sec",
        format: "Voix off sur des plans d'avant, pendant, et après.",
        inspiration: [
          { id: "v3", title: "Avant/Après ongles rongés", views: "120K", likes: "15K", img: "https://images.unsplash.com/photo-1516975080661-46b0a8eb7127?w=400&q=80" }
        ]
      }
    },
    {
      id: "t3",
      day: "Samedi",
      type: "Coulisses / Humour",
      objective: "Visibilité / Sympathie",
      status: "completed",
      details: {
        title: "La phrase que j'entends 10 fois par jour",
        hook: "POV : Quand une cliente me dit qu'elle veut la même couleur que sur Pinterest...",
        script: [
          "(Audio drôle en trend) 'Mais c'est pas la même couleur !'",
          "(Moi) : 'C'est un filtre ! La vraie couleur est celle-ci.'",
          "Montrer la réalité vs la photo filtrée avec autodérision."
        ],
        cta: "Identifie ta pote qui fait toujours ça 😂",
        difficulty: "Très Facile",
        duration: "7 - 10 sec",
        format: "Lip-sync (playback) sur un audio tendance",
        inspiration: []
      }
    }
  ]
};

// ==========================================
// 2. LE COMPOSANT PRINCIPAL
// ==========================================
export default function PlanificateurPage() {
  const [selectedTask, setSelectedTask] = useState<typeof WEEKLY_PLAN.tasks[0] | null>(null);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* EN-TÊTE DE PAGE */}
        <header className="mb-10 text-center md:text-left">
          <Badge variant="outline" className="mb-4 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
            <CalendarDays className="size-3.5 mr-2" />
            Plan de contenu
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-2">
            Semaine du {WEEKLY_PLAN.startDate.split(' ')[1]} au {WEEKLY_PLAN.endDate}
          </h1>
          <p className="text-lg text-zinc-500 font-medium">
            {WEEKLY_PLAN.businessName} • 3 vidéos au programme
          </p>
        </header>

        {/* LISTE DES VIDÉOS (LE TABLEAU DE BORD) */}
        <div className="space-y-4">
          {WEEKLY_PLAN.tasks.map((task) => (
            <Card 
              key={task.id} 
              className={`group overflow-hidden border transition-all duration-200 ${
                task.status === 'completed' 
                  ? 'bg-zinc-100/50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 opacity-60' 
                  : 'bg-white dark:bg-zinc-900 hover:border-blue-400 hover:shadow-md'
              }`}
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center">
                  
                  {/* Jour */}
                  <div className="p-4 md:p-6 md:w-32 bg-zinc-50/50 dark:bg-zinc-950/50 border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-800 flex items-center justify-between md:justify-center">
                    <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                      {task.day}
                    </span>
                    {task.status === 'completed' && (
                      <CheckCircle2 className="size-5 text-green-500 md:hidden" />
                    )}
                  </div>

                  {/* Infos principales */}
                  <div className="p-4 md:p-6 flex-grow flex flex-col justify-center">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="secondary" className="font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-100">
                        {task.type}
                      </Badge>
                      <span className="text-xs font-medium text-zinc-400 flex items-center gap-1">
                        <Target className="size-3" />
                        {task.objective}
                      </span>
                    </div>
                    <p className={`font-semibold text-zinc-800 dark:text-zinc-200 ${task.status === 'completed' ? 'line-through decoration-zinc-400' : ''}`}>
                      {task.details.title}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="p-4 md:p-6 bg-zinc-50/50 dark:bg-zinc-950/50 border-t md:border-t-0 md:border-l border-zinc-100 dark:border-zinc-800 flex justify-end md:justify-center">
                    <Button 
                      onClick={() => setSelectedTask(task)}
                      variant={task.status === 'completed' ? "outline" : "default"}
                      className="w-full md:w-auto font-bold shadow-none"
                    >
                      {task.status === 'completed' ? 'Revoir' : 'Voir le script'}
                      <ArrowRight className="size-4 ml-2" />
                    </Button>
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>

      {/* ========================================== */}
      {/* 3. LA MODALE DÉTAILLÉE (L'EXÉCUTION) */}
      {/* ========================================== */}
      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        {selectedTask && (
          <DialogContent className="sm:max-w-[800px] h-[90vh] p-0 overflow-hidden flex flex-col bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
            <DialogTitle className="sr-only">Plan de tournage : {selectedTask.details.title}</DialogTitle>
            <DialogDescription className="sr-only">Détails, script et instructions pour filmer cette vidéo.</DialogDescription>

            {/* HEADER MODALE */}
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-between items-start gap-4">
              <div>
                <Badge className="mb-3 uppercase tracking-wider font-bold bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">
                  {selectedTask.day} • {selectedTask.type}
                </Badge>
                <h2 className="text-xl md:text-2xl font-black leading-tight text-zinc-900 dark:text-white">
                  {selectedTask.details.title}
                </h2>
              </div>
              {/* Le fameux bouton "Régénérer" dont on parlait */}
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-blue-600 shrink-0" title="Ce sujet ne me correspond pas : Régénérer">
                <RefreshCw className="size-5" />
              </Button>
            </div>

            {/* CONTENU SCROLLABLE */}
            <ScrollArea className="flex-grow">
              <div className="p-6 space-y-8">
                
                {/* Section Technique */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-md">
                    <span>⏱️</span> Durée : {selectedTask.details.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-md">
                    <span>⚙️</span> Format : {selectedTask.details.format}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-md">
                    <span>📊</span> Difficulté : {selectedTask.details.difficulty}
                  </div>
                </div>

                {/* Section Script */}
                <div className="space-y-4">
                  <div className="relative p-5 rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/20">
                    <div className="absolute -top-3 left-4 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                      Le Hook (Accroche)
                    </div>
                    <p className="font-bold text-lg md:text-xl text-zinc-900 dark:text-zinc-100">
                      "{selectedTask.details.hook}"
                    </p>
                  </div>

                  <div className="relative p-5 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="absolute -top-3 left-4 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                      Le Script
                    </div>
                    <ul className="space-y-3 mt-2">
                      {selectedTask.details.script.map((line, idx) => (
                        <li key={idx} className="flex gap-3 text-zinc-700 dark:text-zinc-300">
                          <span className="text-zinc-400 font-bold">{idx + 1}.</span>
                          <p>{line}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="relative p-5 rounded-xl border border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/20">
                    <div className="absolute -top-3 left-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                      L'Appel à l'action (CTA)
                    </div>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">
                      {selectedTask.details.cta}
                    </p>
                  </div>
                </div>

                {/* Section Inspirations (Si disponibles) */}
                {selectedTask.details.inspiration.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-zinc-900 dark:text-white">
                      <Play className="size-5 text-blue-500" />
                      Inspirations (Vidéos similaires)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedTask.details.inspiration.map((video) => (
                        <div key={video.id} className="group cursor-pointer rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 relative bg-zinc-100 dark:bg-zinc-900">
                          <div className="aspect-[9/16] relative">
                            {/* Placeholder d'image pour le MVP */}
                            <img src={video.img} alt={video.title} className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                                <Play className="size-4 text-white ml-1" />
                              </div>
                            </div>
                          </div>
                          <div className="p-2 text-xs">
                            <p className="font-bold truncate text-zinc-900 dark:text-white">{video.title}</p>
                            <div className="flex gap-2 text-zinc-500 mt-1">
                              <span className="flex items-center gap-0.5"><Eye className="size-3" /> {video.views}</span>
                              <span className="flex items-center gap-0.5"><Heart className="size-3" /> {video.likes}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* FOOTER MODALE (Bouton Valider) */}
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex justify-end gap-3 mt-auto">
              <Button variant="outline" onClick={() => setSelectedTask(null)}>
                Fermer
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                <CheckCircle2 className="size-4 mr-2" />
                Marquer comme tournée
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}