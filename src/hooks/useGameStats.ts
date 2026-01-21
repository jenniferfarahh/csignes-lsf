import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

export type GameStats = {
  attempts: { gameId: string; score: number; createdAt: string }[];
  gamesCompleted: number;
  avgScore: number;
  badgesWon: number;
  dailyTarget: number;
  dailyProgress: number;
  playedGameIds: string[];
};

export function useGameStats() {
  const [data, setData] = useState<GameStats | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(false);

    apiGet<GameStats>("/api/games/stats")
      .then((d) => mounted && setData(d))
      .catch(() => mounted && setError(true))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const summary = {
    gamesCompleted: data?.gamesCompleted ?? 0,
    avgScore: data?.avgScore ?? 0,
    badgesWon: data?.badgesWon ?? 0,
    dailyTarget: data?.dailyTarget ?? 5,
    dailyProgress: data?.dailyProgress ?? 0,
    playedGameIds: new Set(data?.playedGameIds ?? []),
  };

  return { data, summary, isLoading, isError };
}
