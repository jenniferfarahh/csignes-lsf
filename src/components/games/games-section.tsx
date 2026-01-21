import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { GameCard } from "./game-card";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Zap, Target } from "lucide-react";
import { useSigns } from "@/hooks/useSigns";
import { useGameStats } from "@/hooks/useGameStats";

import { GuessSignGame } from "./play/GuessSignGame";
import { MimeGuessGame } from "./play/MimeGuessGame";
import { TheoryQuizGame } from "./play/TheoryQuizGame";

type GameId = "guess_sign" | "mime_guess" | "quiz_lsf" | "conversation";

type Game = {
  id: GameId;
  title: string;
  description: string;
  difficulty: "facile" | "moyen" | "difficile";
  duration: string;
  isLocked?: boolean;
};

export function GamesSection() {
  const { data: signs, isLoading: signsLoading, isError: signsError } = useSigns();
  const { summary, reload } = useGameStats();

  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  const completedSet = useMemo(() => new Set(summary.completedGameIds), [summary.completedGameIds]);

  const games: Game[] = useMemo(() => {
    const hasEnoughSigns = signs.length >= 4;

    return [
      {
        id: "guess_sign",
        title: "Devine le signe",
        description: hasEnoughSigns
          ? "Identifie le bon signe parmi plusieurs options"
          : "Ajoute quelques signes (GIFs) pour jouer",
        difficulty: "facile",
        duration: "5 min",
        isLocked: !hasEnoughSigns,
      },
      {
        id: "mime_guess",
        title: "Mime et devine",
        description: hasEnoughSigns
          ? "Observe le GIF, mime, puis réponds au QCM"
          : "Ajoute quelques signes (GIFs) pour jouer",
        difficulty: "moyen",
        duration: "10 min",
        isLocked: !hasEnoughSigns,
      },
      {
        id: "quiz_lsf",
        title: "Quiz express",
        description: "Questions rapides sur la LSF (théorie)",
        difficulty: "facile",
        duration: "3 min",
        isLocked: false,
      },
      {
        id: "conversation",
        title: "Conversation guidée",
        description: "Bientôt disponible",
        difficulty: "difficile",
        duration: "15 min",
        isLocked: true,
      },
    ];
  }, [signs]);

  // ✅ Si un jeu est sélectionné, on affiche son composant (pas besoin de router)
  if (activeGame === "guess_sign") {
    return (
      <GuessSignGame
        signs={signs}
        onBack={() => setActiveGame(null)}
        onCompleted={() => reload()} // recharge stats => disable
      />
    );
  }

  if (activeGame === "mime_guess") {
    return (
      <MimeGuessGame
        signs={signs}
        onBack={() => setActiveGame(null)}
        onCompleted={() => reload()}
      />
    );
  }

  if (activeGame === "quiz_lsf") {
    return (
      <TheoryQuizGame
        onBack={() => setActiveGame(null)}
        onCompleted={() => reload()}
      />
    );
  }

  const stats = [
    { label: "Jeux terminés", value: String(summary.gamesCompleted), icon: Target },
    { label: "Score moyen", value: `${summary.avgScore}%`, icon: Zap },
    { label: "Badges gagnés", value: String(summary.badgesWon), icon: Gamepad2 },
  ];

  return (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Mini-jeux interactifs</h1>
        <p className="text-muted-foreground">Apprends en t'amusant avec nos défis ludiques</p>
      </div>

      {signsLoading && (
        <Card className="p-4 mb-4">
          <p className="text-sm text-muted-foreground">Chargement des signes...</p>
        </Card>
      )}

      {signsError && (
        <Card className="p-4 mb-4">
          <p className="text-sm text-destructive">
            Impossible de charger les signes. Vérifie /api/dictionary.
          </p>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-3 text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="text-primary" size={16} />
                </div>
              </div>
              <p className="font-semibold text-sm">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </Card>
          );
        })}
      </div>

      <Card className="p-4 mb-6 bg-gradient-primary text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">Défi du jour</h3>
            <p className="text-white/90 text-sm">Joue à 5 mini-jeux aujourd'hui</p>
          </div>
          <Badge className="bg-white/20 text-white border-white/30">
            {summary.dailyProgress}/{summary.dailyTarget}
          </Badge>
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Tous les jeux</h2>

        {games.map((game) => {
          const isCompleted = completedSet.has(game.id);

          return (
            <GameCard
              key={game.id}
              title={game.title}
              description={game.description}
              difficulty={game.difficulty}
              duration={game.duration}
              isLocked={game.isLocked}
              isCompleted={isCompleted}
              onPlay={() => setActiveGame(game.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
