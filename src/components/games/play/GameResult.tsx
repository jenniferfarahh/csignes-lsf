import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Flame } from "lucide-react";

type Props = {
  title: string;
  score: number;     // 0..100
  xpAwarded: number; // 0..20
  onBack: () => void;
};

export function GameResult({ title, score, xpAwarded, onBack }: Props) {
  return (
    <div className="p-4 pb-20">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        ← Retour
      </Button>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="text-warning" size={20} />
          <h2 className="text-lg font-semibold">Résultat — {title}</h2>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Score</span>
            <span className="font-semibold">{score}%</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">XP gagnés</span>
            <span className="font-semibold flex items-center gap-1">
              <Flame className="text-warning" size={16} /> +{xpAwarded}
            </span>
          </div>
        </div>

        <Button onClick={onBack} className="w-full mt-5 rounded-xl">
          Retour aux mini-jeux
        </Button>
      </Card>
    </div>
  );
}
