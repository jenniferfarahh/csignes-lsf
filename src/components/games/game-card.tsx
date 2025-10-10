import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Trophy } from "lucide-react";

interface GameCardProps {
  title: string;
  description: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  duration: string;
  score?: number;
  isCompleted?: boolean;
  isLocked?: boolean;
  onPlay: () => void;
}

export function GameCard({
  title,
  description,
  difficulty,
  duration,
  score,
  isCompleted = false,
  isLocked = false,
  onPlay,
}: GameCardProps) {
  const difficultyColors = {
    facile: 'bg-success text-success-foreground',
    moyen: 'bg-warning text-warning-foreground',
    difficile: 'bg-destructive text-destructive-foreground',
  };

  return (
    <Card className={`p-4 transition-all duration-300 hover:scale-[1.02] ${
      isLocked ? 'opacity-50' : 'hover:shadow-lg'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <p className="text-muted-foreground text-sm mb-2">{description}</p>
          
          <div className="flex gap-2 mb-3">
            <Badge className={difficultyColors[difficulty]} variant="secondary">
              {difficulty}
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock size={12} />
              {duration}
            </Badge>
          </div>
        </div>
        
        {isCompleted && (
          <div className="flex items-center gap-1 text-success">
            <Trophy size={16} />
            <span className="text-sm font-medium">{score}</span>
          </div>
        )}
      </div>

      <Button 
        onClick={onPlay}
        disabled={isLocked}
        className="w-full rounded-xl font-medium transition-all duration-300"
        variant={isCompleted ? "outline" : "default"}
      >
        {isLocked ? (
          <>🔒 Débloquer</>
        ) : isCompleted ? (
          <>
            <Star className="mr-2" size={16} />
            Rejouer
          </>
        ) : (
          'Jouer'
        )}
      </Button>
    </Card>
  );
}