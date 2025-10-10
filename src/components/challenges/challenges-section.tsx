import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Zap, Calendar, Star, CheckCircle } from "lucide-react";

interface Challenge {
  id: number;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: string;
  type: 'daily' | 'weekly' | 'special';
  isCompleted?: boolean;
  expiresIn?: string;
}

export function ChallengesSection() {
  // Mock challenges data
  const challenges: Challenge[] = [
    {
      id: 1,
      title: "Apprendre 5 nouveaux signes",
      description: "Découvre 5 signes que tu n'as jamais vus",
      progress: 3,
      target: 5,
      reward: "Badge Explorateur",
      type: "daily",
      expiresIn: "8h 23m",
    },
    {
      id: 2,
      title: "Série de 7 jours",
      description: "Utilise l'app pendant 7 jours consécutifs",
      progress: 4,
      target: 7,
      reward: "50 XP",
      type: "daily",
      expiresIn: "15h 42m",
    },
    {
      id: 3,
      title: "Maître des émotions",
      description: "Complète tous les signes d'émotions",
      progress: 8,
      target: 12,
      reward: "Badge Émotions",
      type: "weekly",
    },
    {
      id: 4,
      title: "Quiz parfait",
      description: "Obtiens 100% à un quiz",
      progress: 1,
      target: 1,
      reward: "Badge Perfectionniste",
      type: "special",
      isCompleted: true,
    },
  ];

  const stats = [
    { label: "Défis terminés", value: "23", icon: Target },
    { label: "Badges gagnés", value: "8", icon: Trophy },
    { label: "Série actuelle", value: "4 jours", icon: Zap },
  ];

  const typeColors = {
    daily: 'bg-primary text-primary-foreground',
    weekly: 'bg-secondary text-secondary-foreground',
    special: 'bg-accent text-accent-foreground',
  };

  const typeLabels = {
    daily: 'Quotidien',
    weekly: 'Hebdomadaire',
    special: 'Spécial',
  };

  return (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Défis quotidiens
        </h1>
        <p className="text-muted-foreground">
          Relève les défis et gagne des badges exclusifs
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

      {/* Streak Card */}
      <Card className="p-4 mb-6 bg-gradient-primary text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="font-semibold">Série en cours</h3>
              <p className="text-white/90 text-sm">4 jours consécutifs</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">🔥</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <div
              key={day}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                day <= 4 
                  ? 'bg-white/30 text-white' 
                  : 'bg-white/10 text-white/50'
              }`}
            >
              {day <= 4 ? <CheckCircle size={12} /> : day}
            </div>
          ))}
        </div>
      </Card>

      {/* Challenges List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Défis disponibles
          </h2>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2" size={16} />
            Historique
          </Button>
        </div>

        {challenges.map((challenge) => (
          <Card 
            key={challenge.id} 
            className={`p-4 transition-all duration-300 hover:shadow-lg ${
              challenge.isCompleted ? 'border-success bg-success/5' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{challenge.title}</h3>
                  {challenge.isCompleted && (
                    <CheckCircle className="text-success" size={16} />
                  )}
                </div>
                <p className="text-muted-foreground text-sm mb-2">
                  {challenge.description}
                </p>
                <div className="flex gap-2 mb-3">
                  <Badge className={typeColors[challenge.type]} variant="secondary">
                    {typeLabels[challenge.type]}
                  </Badge>
                  {challenge.expiresIn && (
                    <Badge variant="outline">
                      Expire dans {challenge.expiresIn}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {!challenge.isCompleted && (
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progression</span>
                  <span>{challenge.progress}/{challenge.target}</span>
                </div>
                <Progress 
                  value={(challenge.progress / challenge.target) * 100} 
                  className="h-2"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="text-warning" size={16} />
                <span className="text-sm font-medium">{challenge.reward}</span>
              </div>
              {challenge.isCompleted && (
                <Badge className="bg-success text-success-foreground">
                  <Star className="mr-1" size={12} />
                  Terminé
                </Badge>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}