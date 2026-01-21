import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Lock } from "lucide-react";

type Props = {
  title: string;
  description: string;
  difficulty: "facile" | "moyen" | "difficile";
  duration: string;
  score?: number;
  isCompleted?: boolean;
  isLocked?: boolean;
  onPlay: () => void;
};

const diffBadge: Record<Props["difficulty"], string> = {
  facile: "bg-success/10 text-success border-success/20",
  moyen: "bg-warning/10 text-warning border-warning/20",
  difficile: "bg-destructive/10 text-destructive border-destructive/20",
};

export function GameCard({
  title,
  description,
  difficulty,
  duration,
  score,
  isCompleted,
  isLocked,
  onPlay,
}: Props) {
  const disabled = !!isLocked || !!isCompleted;

  const buttonLabel = isLocked ? "Débloquer" : isCompleted ? "Déjà joué" : "Jouer";

  return (
    <Card className={`p-4 transition-all ${disabled ? "opacity-70" : "hover:shadow-lg"}`}>
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>

          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline" className={diffBadge[difficulty]}>
              {difficulty}
            </Badge>
            <Badge variant="outline" className="text-muted-foreground">
              <Clock className="mr-1" size={14} /> {duration}
            </Badge>

            {typeof score === "number" && (
              <Badge variant="outline" className="text-muted-foreground">
                Score {score}%
              </Badge>
            )}
          </div>
        </div>

        {isLocked && <Lock className="text-muted-foreground" size={18} />}
      </div>

      <Button
        className={`w-full mt-4 ${isLocked ? "bg-muted text-muted-foreground" : ""}`}
        onClick={onPlay}
        disabled={disabled}
        variant={isLocked ? "secondary" : "default"}
      >
        {buttonLabel}
      </Button>
    </Card>
  );
}
