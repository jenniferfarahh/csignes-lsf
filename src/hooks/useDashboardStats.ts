// src/hooks/useDashboardStats.ts
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

type HistoryWeekDTO = {
  days: Array<{
    date: string; // YYYY-MM-DD
    label: string; // L M ...
    didActivity: boolean;
    isToday: boolean;
  }>;
  activeDaysCount: number;
  streakDays: number;
  globalProgressPct: number;
};

type ProgressMe = {
  xp: number;
};

function startOfWeekUTC(d = new Date()) {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = x.getUTCDay(); // 0=dim
  const diff = day === 0 ? -6 : 1 - day; // lundi
  x.setUTCDate(x.getUTCDate() + diff);
  return x;
}

function endOfWeekUTC(d = new Date()) {
  const s = startOfWeekUTC(d);
  const e = new Date(s);
  e.setUTCDate(e.getUTCDate() + 6);
  return e;
}

const toKey = (d: Date) => d.toISOString().slice(0, 10);

export function useDashboardStats() {
  const weeklyGoal = 5;

  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const from = toKey(startOfWeekUTC());
      const to = toKey(endOfWeekUTC());

      const [p, hw] = await Promise.all([
        apiGet<ProgressMe>("/api/progress/me"),
        apiGet<HistoryWeekDTO>(`/api/history/week?from=${from}&to=${to}`),
      ]);

      const didActivityToday = hw.days?.some((d) => d.isToday && d.didActivity) ?? false;

      return {
        xp: p.xp ?? 0,
        streak: hw.streakDays ?? 0,
        todayProgress: didActivityToday ? 100 : 0,
        weeklyGoal,
        completedDays: hw.activeDaysCount ?? 0,
      };
    },
  });
}
