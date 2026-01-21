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

export function GuessSignGame({ onBack }: Props) {
  const { data: signs, isLoading, isError } = useSigns();
  const usable = signs ?? [];

  const [step, setStep] = useState<"play" | "result">("play");
  const [score, setScore] = useState(0); // 0..100
  const [idx, setIdx] = useState(0);
  const [xpAwarded, setXpAwarded] = useState<number | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const questions = useMemo(() => {
    if (usable.length < 4) return [];
    // 5 questions
    return Array.from({ length: 5 }, () => {
      const pool = shuffle(usable).slice(0, 4);
      const correct = pool[Math.floor(Math.random() * pool.length)];
      return { pool, correctId: correct.id, videoUrl: correct.videoUrl };
    });
  }, [usable]);

  const current = questions[idx];

  async function finish(finalScore: number) {
    try {
      setApiError(null);
      const res = await completeGame("guess_sign", finalScore);
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
          <h2 className="text-xl font-bold mb-2">Résultat — Devine le signe</h2>
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

  // PLAY
  return (
    <div className="p-4 pb-20">
      <Button variant="ghost" onClick={onBack}>← Quitter</Button>

      <div className="mt-2 mb-4">
        <h1 className="text-2xl font-bold">Devine le signe</h1>
        <p className="text-muted-foreground">Question {idx + 1}/{questions.length}</p>
      </div>

      <Card className="p-4">
        {/* videoUrl peut être .gif ou .mp4 */}
        <div className="rounded-xl overflow-hidden bg-muted">
          {current?.videoUrl?.endsWith(".gif") ? (
            <img src={current.videoUrl} className="w-full max-h-[320px] object-contain" />
          ) : (
            <video src={current?.videoUrl} controls autoPlay loop className="w-full max-h-[320px] object-contain" />
          )}
        </div>

        <p className="mt-4 font-semibold">Quel est ce signe ?</p>

        <div className="grid grid-cols-1 gap-2 mt-3">
          {current.pool.map((s) => (
            <Button
              key={s.id}
              variant="outline"
              onClick={async () => {
                const ok = s.id === current.correctId;
                const newScore = score + (ok ? 20 : 0);
                const nextIdx = idx + 1;

                setScore(newScore);

                if (nextIdx >= questions.length) {
                  await finish(newScore);
                } else {
                  setIdx(nextIdx);
                }
              }}
            >
              {s.word}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
