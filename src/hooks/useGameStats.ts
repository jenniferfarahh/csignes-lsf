import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

export type GameStatsSummary = {
  gamesCompleted: number;
  avgScore: number;
  badgesWon: number;
  dailyProgress: number;
  dailyTarget: number;
  completedGameIds: string[];
};

export function useGameStats() {
  const [summary, setSummary] = useState<GameStatsSummary>({
    gamesCompleted: 0,
    avgScore: 0,
    badgesWon: 0,
    dailyProgress: 0,
    dailyTarget: 5,
    completedGameIds: [],
  });

  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  const reload = () => {
    setLoading(true);
    setError(false);

    apiGet<GameStatsSummary>("/api/games/stats")
      .then(setSummary)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reload();
  }, []);

  return { summary, isLoading, isError, reload };
}
