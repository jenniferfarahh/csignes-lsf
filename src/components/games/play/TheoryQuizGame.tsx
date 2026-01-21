import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { completeGame } from "@/hooks/useCompleteGame";
import { GameResult } from "./GameResult";

type Props = {
  onBack: () => void;
  onCompleted: () => void;
};

type Q = { q: string; choices: string[]; correct: number };

const QUESTIONS: Q[] = [
  {
    q: "La LSF signifie :",
    choices: ["Langue des Signes Française", "Langue Sociale Francophone", "Langage Sonore Français"],
    correct: 0,
  },
  {
    q: "Une langue des signes est :",
    choices: ["Un code universel identique partout", "Une langue à part entière", "Juste des gestes improvisés"],
    correct: 1,
  },
  {
    q: "En LSF, l’expression du visage sert surtout à :",
    choices: ["Décorer", "Exprimer la grammaire et le sens", "Remplacer les mains"],
    correct: 1,
  },
  {
    q: "La LSF se lit :",
    choices: ["Uniquement main droite", "Uniquement main gauche", "Avec les mains + le regard + le visage"],
    correct: 2,
  },
];

export function TheoryQuizGame({ onBack, onCompleted }: Props) {
  const quiz = useMemo(() => QUESTIONS, []);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = quiz[idx]!;

  const done = idx >= quiz.length;

  const correctCount = useMemo(() => {
    return answers.filter((a, i) => a === quiz[i]?.correct).length;
  }, [answers, quiz]);

  const score = done ? Math.round((correctCount / quiz.length) * 100) : 0;

  async function finish() {
    setSaving(true);
    setError(null);
    try {
      await completeGame("quiz_lsf", score);
      onCompleted();
    } catch (e: any) {
      setError(e?.message ?? "Erreur");
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    // on calcule xp via backend, mais on affiche juste score ici.
    // Pour afficher xp exact, on pourrait stocker la réponse completeGame.
    // Ici simple: on refait l’appel et on récupère xpAwarded.
    // ✅ On le fait :
    return <TheoryQuizFinish score={score} onBack={onBack} onCompleted={onCompleted} />;
  }

  return (
    <div className="p-4 pb-20">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        ← Quitter
      </Button>

      <div className="mb-4">
        <h1 className="text-xl font-bold">Quiz express (LSF)</h1>
        <p className="text-muted-foreground text-sm">Réponds vite : 4 questions</p>
      </div>

      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline">
            Question {idx + 1}/{quiz.length}
          </Badge>
          <Badge className="bg-primary text-primary-foreground">Théorie</Badge>
        </div>

        <h2 className="font-semibold">{current.q}</h2>

        <div className="space-y-3 mt-4">
          {current.choices.map((c, ci) => (
            <Button
              key={ci}
              variant="outline"
              className="w-full justify-start rounded-xl"
              onClick={() => {
                setAnswers((prev) => [...prev, ci]);
                setIdx((x) => x + 1);
              }}
            >
              {c}
            </Button>
          ))}
        </div>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {saving && <p className="text-sm text-muted-foreground">Sauvegarde...</p>}
    </div>
  );
}

function TheoryQuizFinish({
  score,
  onBack,
  onCompleted,
}: {
  score: number;
  onBack: () => void;
  onCompleted: () => void;
}) {
  const [xp, setXp] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // On rejoue pas: on appelle completeGame ici seulement si pas encore fait.
  // Mais ce composant est appelé après avoir répondu, donc on fait l’appel maintenant.
  // Pour éviter double save, on ne l’a pas fait plus haut.
  // ✅ Donc ici seulement.
  useMemo(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await completeGame("quiz_lsf", score);
        setXp(res.xpAwarded);
        onCompleted();
      } catch (e: any) {
        setErr(e?.message ?? "Erreur");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="p-4 pb-20">
        <p className="text-sm text-muted-foreground">Calcul du résultat...</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="p-4 pb-20">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          ← Retour
        </Button>
        <Card className="p-4">
          <p className="text-sm text-destructive">{err}</p>
        </Card>
      </div>
    );
  }

  return <GameResult title="Quiz express" score={score} xpAwarded={xp} onBack={onBack} />;
}
