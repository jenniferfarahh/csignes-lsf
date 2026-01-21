import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Calendar, Trophy, Flame, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { useHistoryWeek } from "@/hooks/useHistoryWeek";

type Achievement = {
  id: string;
  title: string;
  description: string;
  progressPct: number; // 0..100
  progressLabel: string; // ex: "3/7"
  earned: boolean;
  meta?: string;
};

function buildAchievementsFromHistory(args: {
  streakDays: number;
  globalProgressPct: number;
  activeDaysCount: number;
}) {
  const { streakDays, globalProgressPct, activeDaysCount } = args;

  // ✅ Tout est calculé côté frontend à partir des données réelles API
  const firstStepEarned = activeDaysCount >= 1;
  const firstStepPct = firstStepEarned ? 100 : 0;

  const regularityTarget = 7;
  const regularityEarned = streakDays >= regularityTarget;
  const regularityCount = Math.min(regularityTarget, streakDays);
  const regularityPct = Math.round((regularityCount / regularityTarget) * 100);

  // Exemple "progression globale" => badge si 100%
  const completionEarned = globalProgressPct >= 100;

  const achievements: Achievement[] = [
    {
      id: "first_step",
      title: "Premier pas",
      description: "Faire une activité (cours/jeu) au moins une fois",
      earned: firstStepEarned,
      progressPct: firstStepPct,
      progressLabel: firstStepEarned ? "1/1" : "0/1",
      meta: firstStepEarned ? "Débloqué" : "À débloquer",
    },
    {
      id: "regularity",
      title: "Régularité",
      description: "7 jours consécutifs d’activité",
      earned: regularityEarned,
      progressPct: regularityPct,
      progressLabel: `${regularityCount}/7`,
      meta: regularityEarned ? "Débloqué" : "Continue ta série 🔥",
    },
    {
      id: "completion",
      title: "Persévérant",
      description: "Atteindre 100% de progression globale",
      earned: completionEarned,
      progressPct: Math.min(100, Math.max(0, globalProgressPct)),
      progressLabel: `${Math.min(100, Math.max(0, globalProgressPct))}%`,
      meta: completionEarned ? "Débloqué" : "Avance dans les leçons",
    },
  ];

  return achievements;
}
// ✅ Résumé: génère des badges/achievements sans mock, seulement depuis les données API.

export function HistorySection() {
  const { data, isLoading, isError } = useHistoryWeek();

  const days = data?.days ?? [];
  const activeDaysCount = data?.activeDaysCount ?? 0;
  const streakDays = data?.streakDays ?? 0;
  const globalProgressPct = data?.globalProgressPct ?? 0;

  const achievements = useMemo(
    () =>
      buildAchievementsFromHistory({
        streakDays,
        globalProgressPct,
        activeDaysCount,
      }),
    [streakDays, globalProgressPct, activeDaysCount]
  );

  return (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Historique & Progrès</h1>
        <p className="text-muted-foreground">Suis ton évolution et tes accomplissements</p>
      </div>

      {isLoading && (
        <Card className="p-4 mb-4">
          <p className="text-sm text-muted-foreground">Chargement de tes données...</p>
        </Card>
      )}

      {isError && (
        <Card className="p-4 mb-4">
          <p className="text-sm text-destructive">Impossible de charger l’historique depuis l’API.</p>
        </Card>
      )}

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
