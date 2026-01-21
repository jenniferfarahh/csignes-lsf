// src/hooks/useHistoryWeek.ts
import { useEffect, useMemo, useState } from "react";
import { apiGet } from "@/lib/api";

type WeekAttempt = {
  createdAt: string;
  lessonId: string;
  isCorrect: boolean;
  xpAwarded: number;
};

type WeekApiResponse = {
  attempts: WeekAttempt[];
  xp: number;
  completedLessons: string[];
};

export type WeekDay = {
  label: string; // "L", "M", ...
  date: string;  // "YYYY-MM-DD"
  didActivity: boolean;
  isToday: boolean;
};

export type HistoryWeekData = {
  days: WeekDay[];
  activeDaysCount: number;
  streakDays: number;
  globalProgressPct: number;

  // raw (useful for achievements)
  xp: number;
  completedLessons: string[];
  attempts: WeekAttempt[];
};

const WEEK_LABELS = ["L", "M", "M", "J", "V", "S", "D"] as const;

// If you have 12 lessons total for now:
const TOTAL_LESSONS = 12;

function dayKey(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.toISOString().slice(0, 10);
}
// ✅ returns YYYY-MM-DD key.

function getWeekDatesMondayToSunday() {
  const now = new Date();
  const day = now.getDay(); // 0=Sunday
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
// ✅ returns 7 days of current week Monday -> Sunday.

export function useHistoryWeek() {
  const [data, setData] = useState<HistoryWeekData | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  const weekDates = useMemo(() => getWeekDatesMondayToSunday(), []);
  const fromKey = useMemo(() => dayKey(weekDates[0]!), [weekDates]);
  const toKey = useMemo(() => dayKey(weekDates[6]!), [weekDates]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(false);

    (async () => {
      try {
        const api = await apiGet<WeekApiResponse>(`/api/history/week?from=${fromKey}&to=${toKey}`);

        const attempts = api.attempts ?? [];
        const xp = api.xp ?? 0;
        const completedLessons = api.completedLessons ?? [];

        // active days in this week
        const activeSet = new Set<string>();
        for (const a of attempts) {
          activeSet.add(dayKey(new Date(a.createdAt)));
        }

        const days: WeekDay[] = weekDates.map((d, idx) => {
          const key = dayKey(d);
          return {
            label: WEEK_LABELS[idx]!,
            date: key,
            didActivity: activeSet.has(key),
            isToday: key === dayKey(new Date()),
          };
        });

        const activeDaysCount = days.filter((d) => d.didActivity).length;

        // streak: consecutive active days until today
        let streakDays = 0;
        const cur = new Date();
        cur.setHours(0, 0, 0, 0);

        while (true) {
          const k = dayKey(cur);
          if (!activeSet.has(k)) break;
          streakDays++;
          cur.setDate(cur.getDate() - 1);
        }

        const globalProgressPct =
          TOTAL_LESSONS > 0
            ? Math.min(100, Math.round((completedLessons.length / TOTAL_LESSONS) * 100))
            : 0;

        const finalData: HistoryWeekData = {
          days,
          activeDaysCount,
          streakDays,
          globalProgressPct,
          xp,
          completedLessons,
          attempts,
        };

        if (mounted) setData(finalData);
      } catch (e) {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [fromKey, toKey, weekDates]);

  return { data, isLoading, isError };
}
