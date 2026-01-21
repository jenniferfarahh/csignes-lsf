export function saveGameResult(gameId: string, score: number) {
  const games = JSON.parse(localStorage.getItem("games") ?? "{}");

  games[gameId] = {
    score,
    xp: Math.round(score / 10),
    playedAt: Date.now(),
  };

  localStorage.setItem("games", JSON.stringify(games));
}
