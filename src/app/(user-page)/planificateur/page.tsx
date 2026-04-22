"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CalendarDays, Eye, Heart, Loader2, Play, RefreshCw, Sparkles, Target, WandSparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateWeekPlan, getCurrentWeekPlan, getInspirationVideos, regenerateSingleTask } from "@/app/actions/planner";

type PlanTask = {
  id: string;
  day: string;
  title: string;
  description: string;
  objective: string;
  hook: string;
  script: string[];
  cta: string;
  status: string;
  format_inspiration: string;
};

type WeeklyPlan = {
  id: string;
  startDate: Date | string;
  endDate: Date | string;
  tasks: PlanTask[];
};

type InspirationVideo = {
  id: string;
  title: string;
  url: string;
  platform: string;
  views: number;
  likes: number;
};

function formatWeekLabel(startDate: Date | string, endDate: Date | string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const formatter = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" });
  return `${formatter.format(start)} au ${formatter.format(end)}`;
}

export default function PlanificateurPage() {
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  const [isGeneratingWeek, setIsGeneratingWeek] = useState(false);
  const [isRegeneratingTask, setIsRegeneratingTask] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [inspirationVideos, setInspirationVideos] = useState<InspirationVideo[]>([]);
  const [isLoadingInspiration, setIsLoadingInspiration] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedTask = useMemo(
    () => plan?.tasks.find((task) => task.id === selectedTaskId) ?? null,
    [plan, selectedTaskId]
  );

  const loadCurrentPlan = async () => {
    try {
      setIsLoadingPlan(true);
      setError(null);
      const existingPlan = await getCurrentWeekPlan();
      setPlan((existingPlan as WeeklyPlan | null) ?? null);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Impossible de charger ton plan.";
      setError(message);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  useEffect(() => {
    void loadCurrentPlan();
  }, []);

  useEffect(() => {
    async function loadInspiration() {
      if (!selectedTask?.format_inspiration) {
        setInspirationVideos([]);
        return;
      }

      try {
        setIsLoadingInspiration(true);
        const videos = await getInspirationVideos(selectedTask.format_inspiration);
        setInspirationVideos(videos as InspirationVideo[]);
      } catch {
        setInspirationVideos([]);
      } finally {
        setIsLoadingInspiration(false);
      }
    }

    void loadInspiration();
  }, [selectedTask?.id, selectedTask?.format_inspiration]);

  const handleGenerateWeek = async () => {
    try {
      setIsGeneratingWeek(true);
      setError(null);
      const newPlan = await generateWeekPlan();
      setPlan(newPlan as WeeklyPlan);
    } catch (generationError) {
      const message = generationError instanceof Error ? generationError.message : "La generation de semaine a echoue.";
      setError(message);
    } finally {
      setIsGeneratingWeek(false);
    }
  };

  const handleRegenerateTask = async () => {
    if (!selectedTask) return;
    try {
      setIsRegeneratingTask(true);
      setError(null);
      const updated = await regenerateSingleTask(selectedTask.id);
      setPlan((current) => {
        if (!current) return current;
        return {
          ...current,
          tasks: current.tasks.map((task) =>
            task.id === selectedTask.id ? ({ ...task, ...updated } as PlanTask) : task
          ),
        };
      });
    } catch (regenerationError) {
      const message = regenerationError instanceof Error ? regenerationError.message : "Impossible de regenerer cette idee.";
      setError(message);
    } finally {
      setIsRegeneratingTask(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center md:text-left">
          <Badge variant="outline" className="mb-4 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
            <CalendarDays className="size-3.5 mr-2" />
            Plan de contenu
          </Badge>
          {plan ? (
            <>
              <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-2">
                Semaine du {formatWeekLabel(plan.startDate, plan.endDate)}
              </h1>
              <p className="text-lg text-zinc-500 font-medium">{plan.tasks.length} videos au programme</p>
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-2">
                Planificateur de contenu IA
              </h1>
              <p className="text-lg text-zinc-500 font-medium">Une semaine claire, prete a tourner.</p>
            </>
          )}
        </header>

        {error && (
          <div className="mb-6 rounded-none border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        {isLoadingPlan ? (
          <Card className="border-dashed border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/30">
            <CardContent className="py-16 flex items-center justify-center">
              <div className="flex items-center gap-3 text-zinc-500">
                <Loader2 className="size-5 animate-spin" />
                Chargement de ton planning...
              </div>
            </CardContent>
          </Card>
        ) : !plan ? (
          <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
            <CardContent className="px-8 py-14 text-center">
              <div className="mx-auto mb-5 w-fit rounded-none bg-white/10 p-3">
                <Sparkles className="size-7" />
              </div>
              <h2 className="text-3xl font-black mb-2">Pret pour ta semaine ?</h2>
              <p className="text-zinc-300 max-w-xl mx-auto mb-8">
                Genere un plan video strategique adapte a ton activite en quelques secondes.
              </p>
              <Button
                onClick={handleGenerateWeek}
                disabled={isGeneratingWeek}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white border-none px-6"
              >
                {isGeneratingWeek ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Generation IA en cours...
                  </>
                ) : (
                  <>
                    <WandSparkles className="size-4 mr-2" />
                    Generer ma semaine
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {plan.tasks.map((task) => (
              <Card
                key={task.id}
                className="group overflow-hidden border bg-white dark:bg-zinc-900 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedTaskId(task.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedTaskId(task.id);
                  }
                }}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="p-4 md:p-6 md:w-32 bg-zinc-50/50 dark:bg-zinc-950/50 border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-800 flex items-center justify-between md:justify-center">
                      <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                        {task.day}
                      </span>
                    </div>

                    <div className="p-4 md:p-6 flex-grow flex flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="secondary" className="font-bold bg-zinc-100 dark:bg-zinc-800">
                          {task.format_inspiration}
                        </Badge>
                        <span className="text-xs font-medium text-zinc-500 flex items-center gap-1">
                          <Target className="size-3" />
                          {task.objective}
                        </span>
                      </div>
                      <p className="font-semibold text-zinc-800 dark:text-zinc-200">{task.title}</p>
                    </div>

                    <div className="p-4 md:p-6 bg-zinc-50/50 dark:bg-zinc-950/50 border-t md:border-t-0 md:border-l border-zinc-100 dark:border-zinc-800 flex justify-end md:justify-center">
                      <Button className="w-full md:w-auto font-bold shadow-none">
                        Voir le script
                        <ArrowRight className="size-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTaskId(null)}>
        {selectedTask && (
          <DialogContent className="sm:max-w-[840px] h-[90vh] p-0 overflow-hidden flex flex-col bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
            <DialogTitle className="sr-only">Plan de tournage : {selectedTask.title}</DialogTitle>
            <DialogDescription className="sr-only">Details, script et inspirations pour cette tache.</DialogDescription>

            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-between items-start gap-4">
              <div>
                <Badge className="mb-3 uppercase tracking-wider font-bold bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">
                  {selectedTask.day}
                </Badge>
                <h2 className="text-xl md:text-2xl font-black leading-tight text-zinc-900 dark:text-white mb-2">
                  {selectedTask.title}
                </h2>
                <Badge variant="outline" className="font-medium">
                  Objectif : {selectedTask.objective}
                </Badge>
              </div>
              <Button
                onClick={handleRegenerateTask}
                disabled={isRegeneratingTask}
                variant="outline"
                className="shrink-0 border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-blue-950/40"
              >
                {isRegeneratingTask ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Regeneration...
                  </>
                ) : (
                  <>
                    <RefreshCw className="size-4 mr-2" />
                    🔄 Regenerer cette idee
                  </>
                )}
              </Button>
            </div>

            <ScrollArea className="flex-grow">
              <div className="p-6 space-y-8">
                <div className="space-y-4">
                  <div className="relative p-5 rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/20">
                    <div className="absolute -top-3 left-4 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                      Description
                    </div>
                    <p className="text-zinc-800 dark:text-zinc-200">{selectedTask.description}</p>
                  </div>

                  <div className="relative p-5 rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/20">
                    <div className="absolute -top-3 left-4 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                      Le Hook (Accroche)
                    </div>
                    <p className="font-bold text-lg md:text-xl text-zinc-900 dark:text-zinc-100">
                      &quot;{selectedTask.hook}&quot;
                    </p>
                  </div>

                  <div className="relative p-5 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="absolute -top-3 left-4 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                      Le Script
                    </div>
                    <ul className="space-y-3 mt-2">
                      {selectedTask.script.map((line, idx) => (
                        <li key={idx} className="flex gap-3 text-zinc-700 dark:text-zinc-300">
                          <span className="text-zinc-400 font-bold">{idx + 1}.</span>
                          <p>{line}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="relative p-5 rounded-xl border border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/20">
                    <div className="absolute -top-3 left-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                      L&apos;Appel a l&apos;action (CTA)
                    </div>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">{selectedTask.cta}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-zinc-900 dark:text-white">
                    <Play className="size-5 text-blue-500" />
                    Inspiration : #{selectedTask.format_inspiration}
                  </h3>
                  {isLoadingInspiration ? (
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Loader2 className="size-4 animate-spin" />
                      Recherche de videos d&apos;inspiration...
                    </div>
                  ) : inspirationVideos.length === 0 ? (
                    <p className="text-sm text-zinc-500">
                      Aucune video trouvee pour ce mot-cle. Regenerer l&apos;idee pour tester un autre format.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {inspirationVideos.map((video) => (
                        <Card key={video.id} className="overflow-hidden border-zinc-200 dark:border-zinc-800">
                          <div className="aspect-[9/16] relative bg-zinc-100 dark:bg-zinc-900">
                            <iframe
                              src={video.url}
                              className="absolute inset-0 w-full h-full border-none pointer-events-none opacity-85"
                              title={`Inspiration ${video.title}`}
                              scrolling="no"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                          </div>
                          <div className="p-3">
                            <p className="font-bold text-xs truncate text-zinc-900 dark:text-zinc-100">{video.title}</p>
                            <div className="flex gap-2 text-zinc-500 mt-2 text-[11px]">
                              <span className="flex items-center gap-1">
                                <Eye className="size-3" /> {video.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="size-3" /> {video.likes}
                              </span>
                              <Badge variant="outline" className="text-[10px] ml-auto">
                                {video.platform}
                              </Badge>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex justify-end gap-3 mt-auto">
              <Button variant="outline" onClick={() => setSelectedTaskId(null)}>
                Fermer
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
