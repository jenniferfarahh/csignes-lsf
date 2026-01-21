import { useMemo, useState } from "react";
import type { SignDTO } from "@/hooks/useSigns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { completeGame } from "@/hooks/useCompleteGame";
import { GameResult } from "./GameResult";

function pickRandom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(a: T[]) {
  return [...a].sort(() => Math.random() - 0.5);
}

type Props = {
  signs: SignDTO[];
  onBack: () => void;
  onCompleted: () => void;
};

export function MimeGuessGame({ signs, onBack, onCompleted }: Props) {
  const [phase, setPhase] = useState<"watch" | "answer" | "result">("watch");
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const question = useMemo(() => {
    const correct = pickRandom(signs);
    const others = shuffle(signs.filter(s => s.id !== correct.id)).slice(0, 3);
    const choices = shuffle([correct, ...others]);
    return { correct, choices };
  }, [signs]);

  async function finish(isCorrect: boolean) {
    // mime_guess un peu plus “reward”: score 100 si correct sinon 50 (tu as mimé)
    const s = isCorrect ? 100 : 50;
    setScore(s);

    setSaving(true);
    setError(null);
    try {
      const res = await completeGame("mime_guess", s);
      setXp(res.xpAwarded);
      setPhase("result");
      onCompleted();
    } catch (e: any) {
      setError(e?.message ?? "Erreur");
    } finally {
      setSaving(false);
    }
  }

  if (phase === "result") {
    return <GameResult title="Mime et devine" score={score} xpAwarded={xp} onBack={onBack} />;
  }

  return (
    <div className="p-4 pb-20">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        ← Quitter
      </Button>

      <div className="mb-4">
        <h1 className="text-xl font-bold">Mime et devine</h1>
        <p className="text-muted-foreground text-sm">
          Regarde le GIF, mime-le, puis réponds
        </p>
      </div>

      <Card className="p-4 mb-4">
        <div className="rounded-xl overflow-hidden bg-muted">
          <img
            src={question.correct.videoUrl}
            alt={question.correct.word}
            className="w-full max-h-[320px] object-contain"
          />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <Badge variant="outline">{phase === "watch" ? "Étape 1/2" : "Étape 2/2"}</Badge>
          <Badge className="bg-warning text-warning-foreground">Mime d’abord 🔥</Badge>
        </div>
      </Card>

      {phase === "watch" && (
        <Button className="w-full rounded-xl" onClick={() => setPhase("answer")}>
          J’ai mimé, je réponds
        </Button>
      )}

      {phase === "answer" && (
        <>
          <div className="space-y-3">
            {question.choices.map((c) => (
              <Button
                key={c.id}
                variant={selected === c.id ? "default" : "outline"}
                className="w-full justify-start rounded-xl"
                onClick={() => setSelected(c.id)}
              >
                {c.word}
              </Button>
            ))}
          </div>

          {error && <p className="text-sm text-destructive mt-3">{error}</p>}

          <Button
            className="w-full mt-4 rounded-xl"
            disabled={!selected || saving}
            onClick={() => finish(selected === question.correct.id)}
          >
            Valider
          </Button>
        </>
      )}
    </div>
  );
}
