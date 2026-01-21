import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { completeGame } from "@/hooks/useCompleteGame";

type Props = { onBack: () => void };

type Q = {
  q: string;
  choices: string[];
  correct: number;
};

export function TheoryQuizGame({ onBack }: Props) {
  const [step, setStep] = useState<"play" | "result">("play");
  const [idx, setIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [xpAwarded, setXpAwarded] = useState<number | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const questions: Q[] = useMemo(
    () => [
      {
        q: "La LSF signifie…",
        choices: ["Langue des Signes Française", "Langage Simple Français", "Lecture Sans Fautes"],
        correct: 0,
      },
      {
        q: "La LSF est…",
        choices: ["Une langue à part entière", "Un code universel identique partout", "Une version mimée du français"],
        correct: 0,
      },
      {
        q: "En LSF, les expressions du visage servent surtout à…",
        choices: ["Décorer", "Porter du sens (grammaire/émotion)", "Remplacer les mains"],
        correct: 1,
      },
      {
        q: "Vrai ou faux: chaque pays a la même langue des signes.",
        choices: ["Vrai", "Faux"],
        correct: 1,
      },
      {
        q: "Dans une langue des signes, l’espace devant toi peut servir à…",
        choices: ["Rien", "Placer des personnes/objets dans le discours", "Uniquement compter"],
        correct: 1,
      },
    ],
    []
  );

  async function finish(finalScore: number) {
    try {
      setApiError(null);
      const res = await completeGame("quiz_lsf", finalScore);
      setXpAwarded(res.xpAwarded);
    } catch (e: any) {
      setApiError(e?.message ?? "Erreur");
    } finally {
      setStep("result");
    }
  }

  if (step === "result") {
    const score = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="p-4 pb-20">
        <Button variant="ghost" onClick={onBack}>← Retour</Button>

        <Card className="p-5 mt-4">
          <h2 className="text-xl font-bold mb-2">Résultat — Quiz express</h2>
          <p className="text-muted-foreground mb-2">
            Bonnes réponses: <span className="font-semibold">{correctCount}/{questions.length}</span>
          </p>
          <p className="text-muted-foreground mb-4">
            Score: <span className="font-semibold">{score}%</span>
          </p>

          {typeof xpAwarded === "number" ? (
            <Badge className="bg-success text-success-foreground">+{xpAwarded} XP</Badge>
          ) : (
            <Badge variant="outline">XP non enregistré</Badge>
          )}

          {apiError && <p className="text-sm text-destructive mt-3">{apiError}</p>}

          <Button className="w-full mt-4" onClick={onBack}>Retour aux mini-jeux</Button>
        </Card>
      </div>
    );
  }

  const q = questions[idx];

  return (
    <div className="p-4 pb-20">
      <Button variant="ghost" onClick={onBack}>← Quitter</Button>

      <div className="mt-2 mb-4">
        <h1 className="text-2xl font-bold">Quiz express</h1>
        <p className="text-muted-foreground">Question {idx + 1}/{questions.length}</p>
      </div>

      <Card className="p-4">
        <p className="font-semibold">{q.q}</p>

        <div className="grid grid-cols-1 gap-2 mt-3">
          {q.choices.map((c, i) => (
            <Button
              key={c}
              variant="outline"
              onClick={async () => {
                const ok = i === q.correct;
                const next = idx + 1;

                if (ok) setCorrectCount((x) => x + 1);

                if (next >= questions.length) {
                  const finalCorrect = (ok ? correctCount + 1 : correctCount);
                  const finalScore = Math.round((finalCorrect / questions.length) * 100);
                  await finish(finalScore);
                } else {
                  setIdx(next);
                }
              }}
            >
              {c}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
