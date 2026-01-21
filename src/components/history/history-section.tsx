import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Calendar, Trophy, Flame, TrendingUp } from "lucide-react";

type WeekAttempt = {
  createdAt: string;
  lessonId: string;
  isCorrect: boolean;
  xpAwarded: number;
};

type WeekResponse = {
  attempts: WeekAttempt[];
  xp: number;
  completedLessons: string[];
};

type Achievement = {
  id: string;
  title: string;
  description: string;
  earned: boolean;
  progressPct: number; // 0..100
  progressLabel: string; // ex: "3/7"
  meta?: string;
};

const WEEK_LABELS = ["L", "M", "M", "J", "V", "S", "D"] as const;

// ⚠️ adapte si tu as un autre id pour la leçon alphabet
const ALPHABET_LESSON_ID = "alphabet";

// Si tu as 12 leçons, garde 12. Sinon, mets le vrai total.
const TOTAL_LESSONS = 12;

// ---------- helpers ----------
function dayKey(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.toISOString().slice(0, 10);
}
// ✅ Résume: retourne YYYY-MM-DD à minuit pour comparer des jours.

function getWeekDatesMondayToSunday() {
  const now = new Date();
  const day = now.getDay(); // 0=dimanche
  const diffToMonday = day === 0 ? 6 : day - 1;

  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });
}
// ✅ Résume: renvoie la semaine courante (Lundi → Dimanche).

function parseISODateKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  dt.setHours(0, 0, 0, 0);
  return dt;
}
// ✅ Résume: convertit "YYYY-MM-DD" en Date à minuit.

function relativeDayLabel(fromKey: string, toKey: string) {
  const from = parseISODateKey(fromKey);
  const to = parseISODateKey(toKey);
  const diffDays = Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd’hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 14) return "Il y a 1 semaine";
  return `Il y a ${Math.floor(diffDays / 7)} semaines`;
}
// ✅ Résume: label “Aujourd’hui / Hier / Il y a X jours …”.

export function HistorySection() {
  const [data, setData] = useState<WeekResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // semaine courante
  const weekDates = useMemo(() => getWeekDatesMondayToSunday(), []);
  const fromKey = useMemo(() => dayKey(weekDates[0]!), [weekDates]);
  const toKey = useMemo(() => dayKey(weekDates[6]!), [weekDates]);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setIsLoading(true);
        setIsError(false);

        const res = await fetch(`/api/history/week?from=${fromKey}&to=${toKey}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as WeekResponse;

        if (!alive) return;
        setData(json);
      } catch (e) {
        if (!alive) return;
        setIsError(true);
        setData(null);
      } finally {
        if (!alive) return;
        setIsLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [fromKey, toKey]);

  const attempts = data?.attempts ?? [];
  const xp = data?.xp ?? 0;
  const completedLessons = data?.completedLessons ?? [];

  // jours actifs de la semaine (au moins 1 attempt ce jour)
  const activeDaySet = useMemo(() => {
    const s = new Set<string>();
    for (const a of attempts) s.add(dayKey(new Date(a.createdAt)));
    return s;
  }, [attempts]);
  // ✅ Résume: calcule les jours avec activité.

  const weeklyUi = useMemo(() => {
    return weekDates.map((d, idx) => {
      const k = dayKey(d);
      return {
        label: WEEK_LABELS[idx]!,
        dateKey: k,
        active: activeDaySet.has(k),
        isToday: k === dayKey(new Date()),
      };
    });
  }, [weekDates, activeDaySet]);
  // ✅ Résume: construit les 7 jours + état actif/aujourd’hui.

  const weeklyActiveCount = useMemo(() => weeklyUi.filter((x) => x.active).length, [weeklyUi]);

  // streak réel (jours consécutifs jusqu’à aujourd’hui)
  const currentStreak = useMemo(() => {
    let count = 0;
    const d = new Date();
    d.setHours(0, 0, 0, 0);

    while (true) {
      const k = dayKey(d);
      if (!activeDaySet.has(k)) break;
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }, [activeDaySet]);
  // ✅ Résume: calcule la série de jours consécutifs.

  // progression globale réelle (completedLessons / total)
  const globalPct = useMemo(() => {
    if (TOTAL_LESSONS <= 0) return 0;
    return Math.min(100, Math.round((completedLessons.length / TOTAL_LESSONS) * 100));
  }, [completedLessons.length]);

  // dernier jour actif dans la semaine (pour info)
  const lastActiveMeta = useMemo(() => {
    const today = dayKey(new Date());
    const keys = weeklyUi.filter((d) => d.active).map((d) => d.dateKey).sort();
    if (keys.length === 0) return "Aucune activité cette semaine";
    const last = keys.at(-1)!;
    return `Dernière activité: ${relativeDayLabel(last, today)}`;
  }, [weeklyUi]);

  // Achievements (réels, basés sur DB)
  const achievements: Achievement[] = useMemo(() => {
    const firstStepEarned = completedLessons.length >= 1;

    const alphabetEarned = completedLessons.includes(ALPHABET_LESSON_ID);
    // ✅ Résume: badge Alphabet dépend d’un vrai lessonId.

    const regularityEarned = currentStreak >= 7;
    const regCount = Math.min(7, currentStreak);

    // Expert: basé sur XP (réel)
    const EXPERT_XP_TARGET = 1000;
    const expertEarned = xp >= EXPERT_XP_TARGET;
    const expertPct = Math.min(100, Math.round((xp / EXPERT_XP_TARGET) * 100));

    return [
      {
        id: "first_step",
        title: "Premier pas",
        description: "Terminer ta première leçon",
        earned: firstStepEarned,
        progressPct: Math.min(100, Math.round((Math.min(1, completedLessons.length) / 1) * 100)),
        progressLabel: `${Math.min(1, completedLessons.length)}/1`,
        meta: firstStepEarned ? "Débloqué" : "À débloquer",
      },
      {
        id: "alphabet",
        title: "Alphabet maîtrisé",
        description: "Terminer la leçon Alphabet",
        earned: alphabetEarned,
        progressPct: alphabetEarned ? 100 : 0,
        progressLabel: alphabetEarned ? "1/1" : "0/1",
        meta: alphabetEarned ? "Débloqué" : `À débloquer (lessonId = "${ALPHABET_LESSON_ID}")`,
      },
      {
        id: "regularity",
        title: "Régularité",
        description: "7 jours consécutifs d’activité",
        earned: regularityEarned,
        progressPct: Math.round((regCount / 7) * 100),
        progressLabel: `${regCount}/7`,
        meta: lastActiveMeta,
      },
      {
        id: "expert",
        title: "Expert LSF",
        description: "Atteindre 1000 points",
        earned: expertEarned,
        progressPct: expertPct,
        progressLabel: `${xp}/1000`,
        meta: `XP: ${xp}`,
      },
    ];
  }, [completedLessons, currentStreak, xp, lastActiveMeta]);

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

      {/* Weekly Overview — ✅ joli en desktop (compact + centré) */}
      <Card className="p-4 mb-6">
        <div className="mx-auto w-full max-w-md sm:max-w-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Calendar size={20} />
              Cette semaine
            </h2>
            <Badge className="bg-success text-success-foreground">{weeklyActiveCount}/7 jours</Badge>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weeklyUi.map((d) => (
              <div key={d.dateKey} className="text-center">
                <div
                  className={[
                    "w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium mb-1 mx-auto",
                    d.active ? "bg-warning text-warning-foreground" : "bg-muted text-muted-foreground",
                    d.isToday ? "ring-2 ring-primary/40" : "",
                  ].join(" ")}
                  title={d.dateKey}
                >
                  {d.active ? <Flame size={14} /> : ""}
                </div>
                <span className="text-xs text-muted-foreground">{d.label}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-3">{lastActiveMeta}</p>
        </div>
      </Card>

      {/* Overall Stats — ✅ réels */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 text-center">
          <ProgressRing progress={globalPct} size={60} strokeWidth={4} className="mx-auto mb-3">
            <TrendingUp size={20} className="text-primary" />
          </ProgressRing>
          <p className="font-semibold">Progression globale</p>
          <p className="text-sm text-muted-foreground">{globalPct}% complété</p>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-warning/10 rounded-xl">
              <Flame className="text-warning" size={24} />
            </div>
          </div>
          <p className="font-semibold">Série actuelle</p>
          <p className="text-sm text-muted-foreground">{currentStreak} jour(s)</p>
        </Card>
      </div>

      {/* Achievements — ✅ réels */}
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
