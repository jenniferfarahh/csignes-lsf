import { apiPost } from "@/lib/api";

export type CompleteGameResponse = {
  ok: true;
  gameId: string;
  score: number;
  xpAwarded: number;
  totalXp: number;
};

export async function completeGame(gameId: string, score: number) {
  return apiPost<CompleteGameResponse>("/api/games/attempts", { gameId, score });
}
