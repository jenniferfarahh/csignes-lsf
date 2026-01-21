import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Card } from "@/components/ui/card";
import { Flame, Calendar, Target } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { useAuth } from "@/auth/AuthContext";

interface HeroSectionProps {
  onStartLesson: () => void;
}

export function HeroSection({ onStartLesson }: HeroSectionProps) {
  // Mock data - in real app this would come from user state
  const streak = 12;
  const todayProgress = 75;
  const weeklyGoal = 5;
  const completedDays = 4;
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-card border shadow-sm p-4 md:p-6 mb-6">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="relative z-10">
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold mb-2 text-foreground">
            Bonjour {user?.firstName ?? ""} !
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Continuons à apprendre la LSF ensemble
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
          {/* Streak Card */}
          <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20 p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-warning/20 rounded-lg md:rounded-xl">
                <Flame className="text-warning" size={18} />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-foreground">{streak}</p>
                <p className="text-muted-foreground text-xs md:text-sm">jours</p>
              </div>
            </div>
          </Card>

          {/* Weekly Goal */}
          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20 p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-success/20 rounded-lg md:rounded-xl">
                <Target className="text-success" size={18} />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-foreground">{completedDays}/{weeklyGoal}</p>
                <p className="text-muted-foreground text-xs md:text-sm">objectif</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Today's Progress */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20 p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1 text-sm md:text-base text-foreground">Progression du jour</h3>
              <p className="text-muted-foreground text-xs md:text-sm">Continue comme ça !</p>
            </div>
            <ProgressRing progress={todayProgress} size={50} strokeWidth={4}>
              <span className="text-xs md:text-sm font-bold text-foreground">{todayProgress}%</span>
            </ProgressRing>
          </div>
        </Card>

        <Button 
          size="lg" 
          className="w-full font-semibold py-2.5 md:py-3 text-sm md:text-base rounded-xl md:rounded-2xl transition-all duration-300 hover:scale-[1.02]"
          onClick={() => onStartLesson()}
        >
          <Calendar className="mr-2" size={18} />
          Commencer la leçon du jour
        </Button>
      </div>
    </div>
  );
}