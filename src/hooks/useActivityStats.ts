import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

export type ActivityStats = {
  xp: number;
  streakDays: number;
  didActivityToday: boolean;
  completedLessonsCount: number;
  totalLessons: number;
  globalProgressPct: number;
  firstActivityUnlocked: boolean;
};

export function useActivityStats() {
  const [data, setData] = useState<ActivityStats | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(false);

    apiGet<ActivityStats>("/api/activity/stats")
      .then((d) => mounted && setData(d))
      .catch(() => mounted && setError(true))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  return { data, isLoading, isError };
}
