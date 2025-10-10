import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Calendar, Trophy, Target, Flame, TrendingUp } from "lucide-react";

export function HistorySection() {
  // Mock history data
  const weeklyStats = [
    { day: 'L', completed: true, streak: true },
    { day: 'M', completed: true, streak: true },
    { day: 'M', completed: false, streak: false },
    { day: 'J', completed: true, streak: false },
    { day: 'V', completed: true, streak: false },
    { day: 'S', completed: false, streak: false },
    { day: 'D', completed: false, streak: false },
  ];

  const achievements = [
    { title: "Premier pas", description: "Première leçon terminée", earned: true, date: "Il y a 2 semaines" },
    { title: "Alphabet maîtrisé", description: "Toutes les lettres apprises", earned: true, date: "Il y a 1 semaine" },
    { title: "Régularité", description: "7 jours consécutifs", earned: false, progress: 5 },
    { title: "Expert LSF", description: "100 signes appris", earned: false, progress: 67 },
  ];

  const recentActivity = [
    { date: "Aujourd'hui", activity: "Quiz - Alphabet LSF", score: 85, type: "jeu" },
    { date: "Hier", activity: "Salutations et politesse", progress: 100, type: "cours" },
    { date: "Il y a 2 jours", activity: "Devine le signe", score: 92, type: "jeu" },
    { date: "Il y a 3 jours", activity: "Introduction à la LSF", progress: 100, type: "cours" },
  ];

  return (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Historique & Progrès
        </h1>
        <p className="text-muted-foreground">
          Suis ton évolution et tes accomplissements
        </p>
      </div>

      {/* Weekly Overview */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Calendar size={20} />
            Cette semaine
          </h2>
          <Badge className="bg-success text-success-foreground">
            5/7 jours
          </Badge>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weeklyStats.map((day, index) => (
            <div key={index} className="text-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium mb-1 ${
                  day.completed 
                    ? day.streak 
                      ? 'bg-warning text-warning-foreground' 
                      : 'bg-success text-success-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {day.streak && <Flame size={12} />}
                {day.completed && !day.streak && '✓'}
              </div>
              <span className="text-xs text-muted-foreground">{day.day}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 text-center">
          <ProgressRing progress={75} size={60} strokeWidth={4} className="mx-auto mb-3">
            <TrendingUp size={20} className="text-primary" />
          </ProgressRing>
          <p className="font-semibold">Progression globale</p>
          <p className="text-sm text-muted-foreground">75% complété</p>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-warning/10 rounded-xl">
              <Flame className="text-warning" size={24} />
            </div>
          </div>
          <p className="font-semibold">Série actuelle</p>
          <p className="text-sm text-muted-foreground">12 jours</p>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="p-4 mb-6">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <Trophy size={20} />
          Accomplissements
        </h2>

        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
              <div className={`p-2 rounded-lg ${
                achievement.earned ? 'bg-success/10' : 'bg-muted'
              }`}>
                <Trophy 
                  size={16} 
                  className={achievement.earned ? 'text-success' : 'text-muted-foreground'} 
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-sm">{achievement.title}</h3>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
                {achievement.earned && (
                  <p className="text-xs text-success">{achievement.date}</p>
                )}
              </div>

              {!achievement.earned && achievement.progress && (
                <div className="text-right">
                  <ProgressRing progress={achievement.progress} size={40} strokeWidth={3}>
                    <span className="text-xs font-bold">{achievement.progress}</span>
                  </ProgressRing>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-4">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <Target size={20} />
          Activité récente
        </h2>

        <div className="space-y-3">
          {recentActivity.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
              <div>
                <h3 className="font-medium text-sm">{item.activity}</h3>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
              
              <div className="text-right">
                {item.score && (
                  <Badge className="bg-accent text-accent-foreground">
                    {item.score}%
                  </Badge>
                )}
                {item.progress && (
                  <Badge className="bg-success text-success-foreground">
                    Terminé
                  </Badge>
                )}
                <p className="text-xs text-muted-foreground mt-1 capitalize">
                  {item.type}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}