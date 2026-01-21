// src/components/lesson/daily-lesson.tsx
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useLesson } from "@/hooks/useLesson";
import { apiGet, API_BASE_URL } from "@/lib/api";
import { apiPost } from "@/lib/apiPost";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  Play,
  Sparkles,
  Trophy,
} from "lucide-react";

interface DailyLessonProps {
  onBack?: () => void;
}

type AttemptDTO = {
  selectedIndex: number;
  isCorrect: boolean;
  xpAwarded: number;
};

type LessonStep =
  | { type: "video"; videoUrl?: string }
  | {
      type: "qcm";
      question: string;
      choices: string[];
      correctIndex: number;
    };

type ApiLessonDTO = {
  id: string;
  title: string;
  steps: LessonStep[];
};

const LESSON_ID = "lesson-1";

function formatMinutes(min: number) {
  // ex: 2.5 => "2 min 30"
  const totalSeconds = Math.round(min * 60);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (s === 0) return `${m} min`;
  return `${m} min ${s.toString().padStart(2, "0")}`;
}

export function DailyLesson({ onBack }: DailyLessonProps) {
  const { toast } = useToast();
  const { data: apiLesson, isLoading, isError } = useLesson(LESSON_ID);

  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);

  const [alreadyDone, setAlreadyDone] = useState(false);
  const [isCheckingProgress, setIsCheckingProgress] = useState(true);

  const [showResults, setShowResults] = useState(false);

  const [finalResult, setFinalResult] = useState<null | {
    ok: boolean;
    score: number; // 0..100
    xp: number;
    correctAnswer: string;
    userAnswer: string;
  }>(null);

  // 1) Check si déjà tenté (pour afficher "déjà terminé")
  useEffect(() => {
    if (!apiLesson) return;

    let cancelled = false;

    (async () => {
      try {
        const attempt = await apiGet<AttemptDTO>(
          `/api/progress/me/lesson/${LESSON_ID}/attempt`
        );

        if (cancelled) return;

        const qcm = apiLesson.steps.find((s) => s.type === "qcm") as any;
        const userAnswer = qcm?.choices?.[attempt.selectedIndex] ?? "—";
        const correctAnswer = qcm?.choices?.[qcm?.correctIndex ?? 0] ?? "—";

        setAlreadyDone(true);
        setFinalResult({
          ok: attempt.isCorrect,
          score: attempt.isCorrect ? 100 : 0,
          xp: attempt.xpAwarded ?? 0,
          userAnswer,
          correctAnswer,
        });
      } catch {
        if (!cancelled) setAlreadyDone(false);
      } finally {
        if (!cancelled) setIsCheckingProgress(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [apiLesson]);

  // 2) Construire une leçon “propre” pour la démo (durées cohérentes)
  const lesson = useMemo(() => {
    // fallback si API pas dispo
    const fallback: ApiLessonDTO = {
      id: LESSON_ID,
      title: "Les salutations essentielles",
      steps: [
        { type: "video", videoUrl: "/videos/lesson 1/bonjour.mp4" },
        {
          type: "qcm",
          question: "Que signifie ce signe ?",
          choices: ["Bonjour", "Merci", "Au revoir"],
          correctIndex: 0,
        },
      ],
    };

    const base = (apiLesson as ApiLessonDTO | undefined) ?? fallback;

    const videoStep = base.steps.find((s) => s.type === "video") as any;
    const qcmStep = base.steps.find((s) => s.type === "qcm") as any;

    // On fait une leçon en 4 parties (plus “wow” pour demo)
    return {
      id: base.id,
      title: "Leçon du jour",
      description:
        "Une mini-leçon rapide : regarde, comprends, pratique, puis valide avec un quiz.",
      difficulty: "Débutant",
      // Durées cohérentes (total ~ 8–10 min)
      parts: [
        {
          key: "intro",
          type: "intro" as const,
          title: "Introduction",
          durationMin: 1.0,
        },
        {
          key: "watch",
          type: "video" as const,
          title: "Regarde le signe",
          durationMin: 2.5,
          videoUrl: videoStep?.videoUrl,
        },
        {
          key: "practice",
          type: "practice" as const,
          title: "Pratique guidée",
          durationMin: 2.0,
          tip:
            "Refais le geste 3 fois. Observe la position de la main et le mouvement.",
          videoUrl: videoStep?.videoUrl,
        },
        {
          key: "quiz",
          type: "quiz" as const,
          title: "Quiz final",
          durationMin: 2.0,
          question: qcmStep?.question ?? "Que signifie ce signe ?",
          choices: qcmStep?.choices ?? ["Bonjour", "Merci", "Au revoir"],
          correctIndex: qcmStep?.correctIndex ?? 0,
        },
      ],
    };
  }, [apiLesson]);

  const totalMin = lesson.parts.reduce((acc, p) => acc + p.durationMin, 0);
  const progress = Math.round(((currentStep + 1) / lesson.parts.length) * 100);

  // 3) Handlers
  const exitToPreview = () => {
    setIsStarted(false);
    setCurrentStep(0);
    setSelectedChoiceIndex(null);
  };

  const finishLesson = async () => {
    const quiz = lesson.parts.find((p) => p.type === "quiz") as any;
    if (!quiz) return;

    if (selectedChoiceIndex === null) return;

    const ok = selectedChoiceIndex === quiz.correctIndex;
    const score = ok ? 100 : 0;

    const correctAnswer = quiz.choices?.[quiz.correctIndex] ?? "—";
    const userAnswer = quiz.choices?.[selectedChoiceIndex] ?? "—";

    // Par défaut, XP = 0/10 (cohérent avec ton backend /api/attempts)
    // On poste l’attempt (si déjà tenté => 409, on ignore)
    let xpAwarded = ok ? 10 : 0;

    try {
      if (!alreadyDone) {
        const res = await apiPost(`/api/attempts`, {
          lessonId: LESSON_ID,
          selectedIndex: selectedChoiceIndex,
        });

        // Si ton backend renvoie xpAwarded dans attempt
        if (res?.attempt?.xpAwarded !== undefined) xpAwarded = res.attempt.xpAwarded;
        setAlreadyDone(true);
      }
    } catch (e: any) {
      // si déjà tenté (409) => on laisse
    }

    setFinalResult({
      ok,
      score,
      xp: xpAwarded,
      correctAnswer,
      userAnswer,
    });

    setShowResults(true);
    setIsStarted(false);
    setCurrentStep(0);
    setSelectedChoiceIndex(null);

    toast({
      title: ok ? "Bravo 🎉" : "Presque !",
      description: ok
        ? `Tu gagnes ${xpAwarded} XP.`
        : "Tu peux revoir la leçon demain !",
    });
  };

  // =========================
  // VIEW 1: Preview / Start
  // =========================
  if (!isStarted) {
    return (
      <div className="p-4 pb-20">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Leçon du jour</h1>
              <p className="text-muted-foreground text-sm">
                Objectif : apprendre un signe + valider par un quiz
              </p>
            </div>
          </div>
        </div>

        {isLoading && (
          <Card className="p-4 mb-4">
            <p className="text-sm text-muted-foreground">Chargement de la leçon...</p>
          </Card>
        )}

        {isError && (
          <Card className="p-4 mb-4">
            <p className="text-sm text-destructive">
              Impossible de charger la leçon depuis l’API (fallback local).
            </p>
          </Card>
        )}

        {/* Résultat */}
        {showResults && finalResult && (
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">Résultat</h2>
              <Badge variant="outline" className="gap-1">
                <Trophy size={14} />
                Score {finalResult.score}%
              </Badge>
            </div>

            <div
              className={[
                "p-3 rounded-xl mb-4",
                finalResult.ok ? "bg-success/10 border border-success/20" : "bg-destructive/10 border border-destructive/20",
              ].join(" ")}
            >
              <p className="font-semibold mb-1">
                {finalResult.ok ? "✅ Bravo, bonne réponse !" : "❌ Mauvaise réponse"}
              </p>
              <p className="text-sm text-muted-foreground">
                Ta réponse : <span className="font-medium text-foreground">{finalResult.userAnswer}</span>
                <br />
                Bonne réponse : <span className="font-medium text-foreground">{finalResult.correctAnswer}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <Card className="p-3 text-center">
                <p className="text-xs text-muted-foreground">XP gagnés</p>
                <p className="text-xl font-bold">{finalResult.xp}</p>
              </Card>
              <Card className="p-3 text-center">
                <p className="text-xs text-muted-foreground">Statut</p>
                <p className="text-xl font-bold">{finalResult.ok ? "Validé" : "À revoir"}</p>
              </Card>
            </div>

            <Button className="w-full" variant="outline" onClick={() => setShowResults(false)}>
              Retour
            </Button>
          </Card>
        )}

        {/* Déjà fait */}
        {!showResults && alreadyDone && (
          <Card className="p-6 mb-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold mb-1">Challenge déjà terminé ✅</h2>
                <p className="text-sm text-muted-foreground">
                  Tu as déjà complété la leçon du jour.
                </p>
              </div>
              <Badge className="bg-success text-success-foreground">Terminé</Badge>
            </div>

            <Button className="w-full mt-4" variant="outline" onClick={() => setShowResults(true)}>
              Voir le résultat
            </Button>
          </Card>
        )}

        {/* Preview */}
        {!showResults && !alreadyDone && (
          <Card className="p-6 mb-6">
            <div className="text-center mb-5">
              <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles size={32} className="text-white" />
              </div>

              <h2 className="text-xl font-bold mb-2">{lesson.title}</h2>
              <p className="text-muted-foreground mb-4">{lesson.description}</p>

              <div className="flex justify-center gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-muted-foreground" />
                  <span className="text-sm">{formatMinutes(totalMin)}</span>
                </div>
                <Badge variant="outline">{lesson.difficulty}</Badge>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-center mb-2">Étapes</h3>

              {lesson.parts.map((p, idx) => {
                const Icon =
                  p.type === "video" ? Play : p.type === "quiz" ? CheckCircle : BookOpen;

                return (
                  <div key={p.key} className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                    <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon size={16} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{formatMinutes(p.durationMin)}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {idx + 1}/{lesson.parts.length}
                    </span>
                  </div>
                );
              })}
            </div>

            <Button
              disabled={isCheckingProgress}
              onClick={() => setIsStarted(true)}
              className="w-full h-12 text-lg font-semibold"
            >
              {isCheckingProgress ? "Vérification..." : "Commencer la leçon"}
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Card>
        )}
      </div>
    );
  }

  // =========================
  // VIEW 2: In lesson
  // =========================
  const part = lesson.parts[currentStep];

  return (
    <div className="p-4 pb-20">
      {/* Top progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg md:text-xl font-bold">{lesson.title}</h1>
          <Button variant="ghost" size="sm" onClick={exitToPreview}>
            <ArrowLeft className="mr-1" size={16} />
            Quitter
          </Button>
        </div>

        <Progress value={progress} className="h-2 mb-2" />
        <p className="text-sm text-muted-foreground">
          Étape {currentStep + 1} sur {lesson.parts.length} • {formatMinutes(part.durationMin)}
        </p>
      </div>

      <Card className="p-6 mb-6">
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold">{part.title}</h2>
          <p className="text-sm text-muted-foreground">
            {part.type === "intro"
              ? "Petit briefing rapide avant de commencer."
              : part.type === "video"
              ? "Regarde bien le mouvement et la position des mains."
              : part.type === "practice"
              ? "Reproduis le geste, puis passe au quiz."
              : "Choisis la bonne signification."}
          </p>
        </div>

        {/* CONTENT */}
        {part.type === "intro" && (
          <div className="text-left space-y-3">
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-sm">
                🎯 Objectif : apprendre <span className="font-semibold">un signe</span> et le reconnaître.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-muted/40">
              <p className="text-sm text-muted-foreground">
                Astuce : regarde d’abord le signe en entier, puis refais-le lentement 2–3 fois.
              </p>
            </div>
          </div>
        )}

        {(part.type === "video" || part.type === "practice") && (
          <div className="space-y-4">
            {part.type === "practice" && (
              <div className="p-3 rounded-xl bg-warning/10 border border-warning/20 text-left">
                <p className="text-sm">
                  🧠 <span className="font-semibold">Conseil :</span> {part.tip}
                </p>
              </div>
            )}

            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              <video
                controls
                className="w-full h-full"
                src={`${API_BASE_URL}${(part as any).videoUrl ?? ""}`}
              />
            </div>

            {part.type === "practice" && (
              <div className="grid grid-cols-3 gap-2">
                <Card className="p-2 text-center">
                  <p className="text-xs text-muted-foreground">Répète</p>
                  <p className="font-bold">x3</p>
                </Card>
                <Card className="p-2 text-center">
                  <p className="text-xs text-muted-foreground">Mains</p>
                  <p className="font-bold">OK</p>
                </Card>
                <Card className="p-2 text-center">
                  <p className="text-xs text-muted-foreground">Mouvement</p>
                  <p className="font-bold">OK</p>
                </Card>
              </div>
            )}
          </div>
        )}

        {part.type === "quiz" && (
          <div className="text-left">
            <p className="font-semibold mb-3">{(part as any).question}</p>

            <div className="space-y-2">
              {(part as any).choices.map((choice: string, idx: number) => (
                <Button
                  key={idx}
                  variant={selectedChoiceIndex === idx ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedChoiceIndex(idx)}
                >
                  {choice}
                </Button>
              ))}
            </div>

          </div>
        )}

        {/* NAV */}
        <div className="flex gap-3 mt-6">
          {currentStep > 0 && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setSelectedChoiceIndex(null);
                setCurrentStep((s) => s - 1);
              }}
            >
              Précédent
            </Button>
          )}

          <Button
            className="flex-1"
            disabled={part.type === "quiz" && selectedChoiceIndex === null}
            onClick={async () => {
              if (currentStep < lesson.parts.length - 1) {
                setSelectedChoiceIndex(null);
                setCurrentStep((s) => s + 1);
                return;
              }
              // dernière étape => finish
              await finishLesson();
            }}
          >
            {currentStep < lesson.parts.length - 1 ? "Suivant" : "Terminer"}
            <ArrowRight className="ml-2" size={16} />
          </Button>
        </div>
      </Card>
    </div>
  );
}
