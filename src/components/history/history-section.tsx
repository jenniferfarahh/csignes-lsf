// src/components/history/history-section.tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Calendar, Trophy, Flame, TrendingUp } from "lucide-react";

type DayItem = {
  date: string;
  label: string; // L M M J V S D
  didActivity: boolean;
  isToday?: boolean;
};

type Achievement = {
  id: string;
  title: string;
  description: string;
  progressPct: number; // 0..100
  progressLabel: string; // ex: "1/7"
  earned: boolean;
  meta?: string;
};

export function HistorySection() {
  // ✅ MOCK DATA FIXE (même pour tout le monde)
  const activeDaysCount: number = 1;      // 1 jour actif cette semaine
  const streakDays: number = 1;           // série actuelle = 1
  const globalProgressPct: number = 10;   // progression globale = 10%

  // ✅ Semaine: flamme sur Mercredi (3ème "M")
  const days: DayItem[] = [
    { date: "2026-01-19", label: "L", didActivity: false },
    { date: "2026-01-20", label: "M", didActivity: false },
    { date: "2026-01-21", label: "M", didActivity: true, isToday: true }, // 🔥 mercredi (aujourd'hui)
    { date: "2026-01-22", label: "J", didActivity: false },
    { date: "2026-01-23", label: "V", didActivity: false },
    { date: "2026-01-24", label: "S", didActivity: false },
    { date: "2026-01-25", label: "D", didActivity: false },
  ];

  const achievements: Achievement[] = [
    {
      id: "first_step",
      title: "Premier pas",
      description: "Faire une activité (cours/jeu) au moins une fois",
      earned: true,
      progressPct: 100,
      progressLabel: "1/1",
      meta: "Débloqué",
    },
    {
      id: "regularity",
      title: "Régularité",
      description: "7 jours consécutifs d’activité",
      earned: false,
      progressPct: Math.round((1 / 7) * 100),
      progressLabel: "1/7",
      meta: "Continue ta série 🔥",
    },
    {
      id: "completion",
      title: "Persévérant",
      description: "Atteindre 100% de progression globale",
      earned: false,
      progressPct: 10,
      progressLabel: "10%",
      meta: "Avance dans les leçons",
    },
  ];

  return (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Historique & Progrès</h1>
        <p className="text-muted-foreground">Suis ton évolution et tes accomplissements</p>
      </div>

      {/* Weekly Overview */}
      <Card className="p-4 mb-6">
        <div className="mx-auto w-full max-w-md sm:max-w-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Calendar size={20} />
              Cette semaine
            </h2>
            <Badge className="bg-success text-success-foreground">{activeDaysCount}/7 jours</Badge>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-4">
            {days.map((d) => (
              <div key={d.date} className="text-center">
                <div
                  className={[
                    "mx-auto rounded-full flex items-center justify-center text-xs font-medium mb-1",
                    "w-9 h-9 sm:w-11 sm:h-11",
                    d.didActivity ? "bg-warning text-warning-foreground" : "bg-muted text-muted-foreground",
                    d.isToday ? "ring-2 ring-primary/40" : "",
                  ].join(" ")}
                  title={d.date}
                >
                  {d.didActivity ? <Flame size={14} /> : ""}
                </div>
                <span className="text-xs text-muted-foreground">{d.label}</span>
              </div>
            ))}
          </div>

          {activeDaysCount === 0 && (
            <p className="text-xs text-muted-foreground mt-3">Aucune activité cette semaine</p>
          )}
        </div>
      </Card>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 text-center">
          <ProgressRing progress={globalProgressPct} size={60} strokeWidth={4} className="mx-auto mb-3">
            <TrendingUp size={20} className="text-primary" />
          </ProgressRing>
          <p className="font-semibold">Progression globale</p>
          <p className="text-sm text-muted-foreground">{globalProgressPct}% complété</p>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-warning/10 rounded-xl">
              <Flame className="text-warning" size={24} />
            </div>
          </div>
          <p className="font-semibold">Série actuelle</p>
          <p className="text-sm text-muted-foreground">{streakDays} jour(s)</p>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="p-4 mb-6">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <Trophy size={20} />
          Accomplissements
        </h2>

        <div className="space-y-3">
          {achievements.map((a) => (
            <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
              <div className={`p-2 rounded-lg ${a.earned ? "bg-success/10" : "bg-muted"}`}>
                <Trophy size={16} className={a.earned ? "text-success" : "text-muted-foreground"} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm">{a.title}</h3>
                <p className="text-xs text-muted-foreground">{a.description}</p>
                {a.meta && (
                  <p className={`text-xs ${a.earned ? "text-success" : "text-muted-foreground"}`}>
                    {a.meta}
                  </p>
                )}
              </div>

              <div className="text-right">
                <ProgressRing progress={a.progressPct} size={44} strokeWidth={3}>
                  <span className="text-[10px] font-bold">{a.progressLabel}</span>
                </ProgressRing>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
