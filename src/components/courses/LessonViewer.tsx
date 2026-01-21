// src/components/courses/LessonViewer.tsx
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Play } from "lucide-react";

export type LessonStep = {
  id: string;
  word: string;
  description: string;
  minutes: number;
  videoSrc: string; // URL vidéo (peut être locale /public/videos/... ou API)
};

type Props = {
  title: string;
  lessonId: string;
  steps: LessonStep[];
  watched: Record<string, boolean>;
  onWatchedStep: (stepId: string, minutes: number) => void;
  onCompleteLesson: () => void;
  onBack: () => void;
};

export function LessonViewer({
  title,
  lessonId,
  steps,
  watched,
  onWatchedStep,
  onCompleteLesson,
  onBack,
}: Props) {
  const [activeStepId, setActiveStepId] = useState(steps[0]?.id ?? "");

  const activeStep = useMemo(() => steps.find((s) => s.id === activeStepId) ?? steps[0], [steps, activeStepId]);

  const allWatched = steps.every((s) => watched[s.id]);

  return (
    <div className="p-4 pb-20">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft size={18} />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="text-xs text-muted-foreground">ID: {lessonId}</p>
        </div>
        <Badge variant="outline">{steps.length} vidéos</Badge>
      </div>

      {/* Liste des signes */}
      <Card className="p-4 mb-4">
        <h2 className="font-semibold mb-3">Signes à apprendre</h2>

        <div className="space-y-2">
          {steps.map((s, idx) => {
            const done = !!watched[s.id];
            return (
              <button
                key={s.id}
                onClick={() => setActiveStepId(s.id)}
                className={[
                  "w-full text-left p-3 rounded-xl border transition",
                  activeStepId === s.id ? "border-primary bg-primary/5" : "border-border bg-background",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-sm">
                      {idx + 1}. {s.word}
                    </p>
                    <p className="text-xs text-muted-foreground">{s.description}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{s.minutes} min</p>
                  </div>

                  <div className="pt-0.5">
                    {done ? (
                      <CheckCircle className="text-success" size={18} />
                    ) : (
                      <Play className="text-muted-foreground" size={18} />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Player */}
      {activeStep && (
        <Card className="p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold">{activeStep.word}</p>
              <p className="text-xs text-muted-foreground">{activeStep.description}</p>
            </div>
            <Badge variant="secondary">{activeStep.minutes} min</Badge>
          </div>

          <div className="aspect-video rounded-xl overflow-hidden bg-black mb-3">
            <video
              className="w-full h-full"
              controls
              src={activeStep.videoSrc}
              onEnded={() => onWatchedStep(activeStep.id, activeStep.minutes)}
            />
          </div>

          {!watched[activeStep.id] ? (
            <p className="text-xs text-muted-foreground">
              💡 Astuce : la vidéo se valide automatiquement quand elle se termine.
            </p>
          ) : (
            <p className="text-xs text-success font-medium">✅ Vidéo validée</p>
          )}
        </Card>
      )}

      {/* Fin */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{allWatched ? "Leçon terminée 🎉" : "Termine toutes les vidéos"}</p>
            <p className="text-xs text-muted-foreground">
              {steps.filter((s) => watched[s.id]).length}/{steps.length} validées
            </p>
          </div>

          <Button disabled={!allWatched} onClick={onCompleteLesson}>
            Valider la leçon
          </Button>
        </div>
      </Card>
    </div>
  );
}
