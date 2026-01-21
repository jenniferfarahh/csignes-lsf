import { useMemo } from "react";
import { useHistoryWeek } from "@/hooks/useHistoryWeek";
import { useProgress } from "@/hooks/useProgress";

const TOTAL_LESSONS = 12; // mets le vrai total si différent

export function useDashboardStats() {
  const hw = useHistoryWeek();       // { data, isLoading, isError }
  const pr = useProgress();          // { data, isLoading, isError }

  const isLoading = hw.isLoading || pr.isLoading;
  const isError = hw.isError || pr.isError;

  const xp = pr.data?.xp ?? 0;
  const completedLessons = pr.data?.completedLessons ?? [];

  const levelNumber = 1 + Math.floor(xp / 100);

  // "progression du jour" = ici on fait simple & réel:
  // si activité aujourd'hui => 100%, sinon 0%. (Pas de mock)
  const todayProgress = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const key = today.toISOString().slice(0, 10);

    const didToday = hw.data?.days?.some((d) => d.date === key && d.didActivity) ?? false;
    return didToday ? 100 : 0;
  }, [hw.data?.days]);

  // progrès global réel
  const globalProgressPct = useMemo(() => {
    if (TOTAL_LESSONS <= 0) return 0;
    return Math.min(100, Math.round((completedLessons.length / TOTAL_LESSONS) * 100));
  }, [completedLessons.length]);

  // "défis" = on met un objectif réel calculable (ex: 5 jours actifs semaine)
  const weeklyGoal = 5;
  const completedDays = hw.data?.activeDaysCount ?? 0;

  return {
    isLoading,
    isError,

    // user stats
    xp,
    levelNumber,
    completedLessonsCount: completedLessons.length,

    // week stats (réel)
    streak: hw.data?.streakDays ?? 0,
    completedDays,
    weeklyGoal,

    // UI stats
    todayProgress,
    globalProgressPct,
  };
}
