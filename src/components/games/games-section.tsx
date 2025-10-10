import { Card } from "@/components/ui/card";
import { GameCard } from "./game-card";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Zap, Target } from "lucide-react";

export function GamesSection() {
  // Mock game data
  const games = [
    {
      id: 1,
      title: "Devine le signe",
      description: "Identifie le bon signe parmi plusieurs options",
      difficulty: "facile" as const,
      duration: "5 min",
      score: 85,
      isCompleted: true,
    },
    {
      id: 2,
      title: "Mime et devine",
      description: "Reproduis les signes à l'écran",
      difficulty: "moyen" as const,
      duration: "10 min",
      isCompleted: false,
    },
    {
      id: 3,
      title: "Quiz express",
      description: "Questions rapides sur la LSF",
      difficulty: "facile" as const,
      duration: "3 min",
      score: 92,
      isCompleted: true,
    },
    {
      id: 4,
      title: "Conversation guidée",
      description: "Dialogue interactif en LSF",
      difficulty: "difficile" as const,
      duration: "15 min",
      isLocked: true,
    },
  ];

  const stats = [
    { label: "Jeux terminés", value: "12", icon: Target },
    { label: "Score moyen", value: "89%", icon: Zap },
    { label: "Badges gagnés", value: "5", icon: Gamepad2 },
  ];

  return (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Mini-jeux interactifs
        </h1>
        <p className="text-muted-foreground">
          Apprends en t'amusant avec nos défis ludiques
        </p>
      </div>

      {/* Stats Cards */}
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

      {/* Daily Challenge */}
      <Card className="p-4 mb-6 bg-gradient-primary text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">Défi du jour</h3>
            <p className="text-white/90 text-sm">
              Apprends 5 nouveaux signes aujourd'hui
            </p>
          </div>
          <Badge className="bg-white/20 text-white border-white/30">
            2/5
          </Badge>
        </div>
      </Card>

      {/* Games Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Tous les jeux
        </h2>
        
        {games.map((game) => (
          <GameCard
            key={game.id}
            title={game.title}
            description={game.description}
            difficulty={game.difficulty}
            duration={game.duration}
            score={game.score}
            isCompleted={game.isCompleted}
            isLocked={game.isLocked}
            onPlay={() => {
              alert(`Lancement du jeu: ${game.title}`);
            }}
          />
        ))}
      </div>
    </div>
  );
}