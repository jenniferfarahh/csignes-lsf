import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSigns } from "@/hooks/useSigns";
import { completeGame } from "@/hooks/useCompleteGame";

type Props = { onBack: () => void };

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function MimeGuessGame({ onBack }: Props) {
  const { data: signs, isLoading, isError } = useSigns();
  const usable = signs ?? [];

  const [step, setStep] = useState<"play" | "result">("play");
  const [score, setScore] = useState(0);
  const [idx, setIdx] = useState(0);
  const [xpAwarded, setXpAwarded] = useState<number | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const rounds = useMemo(() => {
    if (usable.length < 4) return [];
    return Array.from({ length: 7 }, () => {
      const pool = shuffle(usable).slice(0, 4);
      const correct = pool[Math.floor(Math.random() * pool.length)];
      return { pool, correctId: correct.id, videoUrl: correct.videoUrl, word: correct.word };
    });
  }, [usable]);

  const current = rounds[idx];

  async function finish(finalScore: number) {
    try {
      setApiError(null);
      const res = await completeGame("mime_guess", finalScore);
      setXpAwarded(res.xpAwarded);
    } catch (e: any) {
      setApiError(e?.message ?? "Erreur");
    } finally {
      setStep("result");
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 pb-20">
        <Card className="p-4">Chargement…</Card>
      </div>
    );
  }

  if (isError || usable.length < 4) {
    return (
      <div className="p-4 pb-20">
        <Button variant="ghost" onClick={onBack}>← Retour</Button>
        <Card className="p-4 mt-4">
          <p className="text-sm text-destructive">
            Pas assez de signes pour jouer. Ajoute au moins 4 signes dans la DB.
          </p>
        </Card>
      </div>
    );
  }

  if (step === "result") {
    return (
      <div className="p-4 pb-20">
        <Button variant="ghost" onClick={onBack}>← Retour</Button>

        <Card className="p-5 mt-4">
          <h2 className="text-xl font-bold mb-2">Résultat — Mime et devine</h2>
          <p className="text-muted-foreground mb-4">Ton score: <span className="font-semibold">{score}%</span></p>

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

  return (
    <div className="p-4 pb-20">
      <Button variant="ghost" onClick={onBack}>← Quitter</Button>

      <div className="mt-2 mb-4">
        <h1 className="text-2xl font-bold">Mime le signe</h1>
        <p className="text-muted-foreground">Round {idx + 1}/{rounds.length}</p>
      </div>

      <Card className="p-4">
        <div className="rounded-xl overflow-hidden bg-muted">
          {current?.videoUrl?.endsWith(".gif") ? (
            <img src={current.videoUrl} className="w-full max-h-[320px] object-contain" />
          ) : (
            <video src={current?.videoUrl} controls autoPlay loop className="w-full max-h-[320px] object-contain" />
          )}
        </div>

        <p className="mt-4 font-semibold">Choisis le bon mot :</p>

        <div className="grid grid-cols-1 gap-2 mt-3">
          {current.pool.map((s) => (
            <Button
              key={s.id}
              variant="outline"
              onClick={async () => {
                const ok = s.id === current.correctId;
                const newScore = score + (ok ? Math.round(100 / rounds.length) : 0);
                const next = idx + 1;

                setScore(newScore);

                if (next >= rounds.length) {
                  await finish(Math.min(100, newScore));
                } else {
                  setIdx(next);
                }
              }}
            >
              {s.word}
            </Button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Astuce: mime le signe avant de répondre 😉
        </p>
      </Card>
    </div>
  );
}
