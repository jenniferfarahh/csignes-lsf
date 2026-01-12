import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, BookOpen, CheckCircle, Clock, Star, ArrowRight, ArrowLeft } from "lucide-react";
import { LessonResults } from "./lesson-results";
import { useLesson } from "@/hooks/useLesson";
import { apiPost } from "@/lib/apiPost";
import { useToast } from "@/hooks/use-toast";


interface LessonStep {
  id: number;
  type: 'video' | 'practice' | 'quiz';
  title: string;
  duration: string;
  isCompleted?: boolean;
}

interface DailyLessonProps {
  onBack?: () => void;
}

export function DailyLesson({ onBack }: DailyLessonProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const { toast } = useToast();
  const { data: apiLesson, isLoading, isError } = useLesson("lesson-1");


  // Mock results data
  const todayResults = {
    score: 85,
    questions: [
      { question: "Quel signe représente 'Papa'?", userAnswer: "Signe A", correctAnswer: "Signe A", isCorrect: true },
      { question: "Quel signe représente 'Maman'?", userAnswer: "Signe B", correctAnswer: "Signe B", isCorrect: true },
      { question: "Quel signe représente 'Enfant'?", userAnswer: "Signe C", correctAnswer: "Signe D", isCorrect: false },
      { question: "Quel signe représente 'Famille'?", userAnswer: "Signe E", correctAnswer: "Signe E", isCorrect: true },
    ],
  };

  const previousLessons = [
    { 
      title: "Salutations de base", 
      completed: true, 
      score: 95,
      questions: [
        { question: "Quel signe pour 'Bonjour'?", userAnswer: "Correct", correctAnswer: "Correct", isCorrect: true },
        { question: "Quel signe pour 'Au revoir'?", userAnswer: "Correct", correctAnswer: "Correct", isCorrect: true },
      ]
    },
    { 
      title: "L'alphabet LSF", 
      completed: true, 
      score: 88,
      questions: [
        { question: "Lettre A", userAnswer: "Correct", correctAnswer: "Correct", isCorrect: true },
        { question: "Lettre B", userAnswer: "Wrong", correctAnswer: "Correct", isCorrect: false },
      ]
    },
    { 
      title: "Les couleurs", 
      completed: true, 
      score: 92,
      questions: [
        { question: "Couleur rouge", userAnswer: "Correct", correctAnswer: "Correct", isCorrect: true },
        { question: "Couleur bleu", userAnswer: "Correct", correctAnswer: "Correct", isCorrect: true },
      ]
    },
  ];

  // Mock daily lesson data
  const mockLesson = {
    title: "Les membres de la famille",
    description: "Apprends à signer tous les membres de ta famille",
    difficulty: "Débutant",
    estimatedTime: "15 min",
    steps: [
      {
        id: 1,
        type: 'video' as const,
        title: "Introduction - La famille",
        duration: "3 min",
      },
      {
        id: 2,
        type: 'video' as const,
        title: "Papa, Maman, Enfants",
        duration: "5 min",
      },
      {
        id: 3,
        type: 'practice' as const,
        title: "Pratique guidée",
        duration: "4 min",
      },
      {
        id: 4,
        type: 'quiz' as const,
        title: "Quiz final",
        duration: "3 min",
      },
    ],
  };
    const lesson = apiLesson
    ? {
        title: apiLesson.title,
        description: "Leçon chargée depuis l’API",
        difficulty: "Débutant",
        estimatedTime: "—",
        steps: apiLesson.steps.map((s, idx) => ({
          id: idx + 1,
          type: s.type === "qcm" ? ("quiz" as const) : ("video" as const),
          title:
            s.type === "qcm"
              ? "Question (QCM)"
              : `Vidéo ${idx + 1}`,
          duration: "—",
          videoUrl: s.videoUrl,
          question: s.question,
          choices: s.choices,
        })),
      }
    : mockLesson;


  const getStepIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Play;
      case 'practice':
        return BookOpen;
      case 'quiz':
        return CheckCircle;
      default:
        return Play;
    }
  };

  const progress = ((currentStep) / lesson.steps.length) * 100;

  if (!isStarted) {
    return (
      <div className="p-4 pb-20">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Leçon du jour
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground">
            Ta leçon quotidienne personnalisée
          </p>
        </div>

        {isLoading && (
          <Card className="p-4 mb-4">
            <p className="text-sm text-muted-foreground">Chargement de la leçon...</p>
          </Card>
        )}

        {isError && (
          <Card className="p-4 mb-4">
            <p className="text-sm text-destructive">
              Impossible de charger la leçon depuis l’API. (Fallback local)
            </p>
          </Card>
        )}

        {/* Lesson Preview */}
        <Card className="p-6 mb-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen size={32} className="text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2">{lesson.title}</h2>
            <p className="text-muted-foreground mb-4">{lesson.description}</p>
            
            <div className="flex justify-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-muted-foreground" />
                <span className="text-sm">{lesson.estimatedTime}</span>
              </div>
              <Badge variant="outline">{lesson.difficulty}</Badge>
            </div>
          </div>

          {/* Lesson Steps Preview */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-center mb-4">Contenu de la leçon</h3>
            {lesson.steps.map((step, index) => {
              const Icon = getStepIcon(step.type);
              return (
                <div key={step.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.duration}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {index + 1}/{lesson.steps.length}
                  </span>
                </div>
              );
            })}
          </div>

          <Button 
            onClick={() => {
              if (isCompleted) {
                setSelectedLesson(-1);
              } else {
                setIsStarted(true);
              }
            }}
            className="w-full h-12 text-lg font-semibold"
          >
            {isCompleted ? 'Voir mes résultats' : 'Commencer la leçon'}
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </Card>

        {/* Previous Lessons */}
        <div>
          <h3 className="font-semibold mb-4">Leçons précédentes</h3>
          <div className="space-y-3">
            {previousLessons.map((prevLesson, index) => (
              <Card 
                key={index} 
                className="p-4 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setSelectedLesson(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <CheckCircle size={20} className="text-success" />
                    </div>
                    <div>
                      <p className="font-medium">{prevLesson.title}</p>
                      <p className="text-sm text-muted-foreground">Terminée</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-warning" />
                    <span className="font-semibold">{prevLesson.score}%</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Lesson in progress view
  return (
    <div className="p-4 pb-20">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg md:text-xl font-bold">{lesson.title}</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setIsStarted(false);
              setCurrentStep(0);
            }}
          >
            <ArrowLeft className="mr-1" size={16} />
            Quitter
          </Button>
        </div>
        <Progress value={progress} className="h-2 mb-2" />
        <p className="text-sm text-muted-foreground">
          Étape {currentStep + 1} sur {lesson.steps.length}
        </p>
      </div>

      {/* Current Step */}
      <Card className="p-6 mb-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            {(() => {
              const Icon = getStepIcon(lesson.steps[currentStep]?.type);
              return <Icon size={24} className="text-white" />;
            })()}
          </div>
          <h2 className="text-lg font-bold mb-2">
            {lesson.steps[currentStep]?.title}
          </h2>
          <p className="text-muted-foreground mb-6">
            Durée estimée: {lesson.steps[currentStep]?.duration}
          </p>
          
          {/* Video placeholder */}
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-6 overflow-hidden">
            {(() => {
              const step: any = lesson.steps[currentStep];
              if (step?.type === "video" && step?.videoUrl) {
                return (
                  <video
                    src={step.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                );
              }

              if (step?.type === "quiz" && step?.question) {
                return (
                  <div className="p-4 w-full">
                    <p className="font-semibold mb-3">{step.question}</p>
                    <div className="space-y-2">
                      {(step.choices ?? []).map((choice: string, i: number) => (
                        <Button
                          key={i}
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => {
                            toast({ title: "Réponse choisie", description: choice });
                          }}
                        >
                          {choice}
                        </Button>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div className="text-center">
                  <Play size={48} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">Contenu de la leçon</p>
                </div>
              );
            })()}
          </div>

          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1"
              >
                Précédent
              </Button>
            )}
            <Button 
              onClick={async() => {
                if (currentStep < lesson.steps.length - 1) {
                  setCurrentStep(currentStep + 1);
                } else {
                  try {
                    await apiPost(`/api/progress/demo/lesson-complete`, {
                      lessonId: "lesson-1",
                      xp: 10,
                    });

                    toast({
                      title: "Leçon terminée ✅",
                      description: "+10 XP ajoutés à ton profil",
                    });
                  } catch (e) {
                    toast({
                      title: "Erreur",
                      description: "Impossible d’enregistrer la progression (API).",
                      variant: "destructive",
                    });
                  }

                  setIsCompleted(true);
                  setIsStarted(false);
                  setCurrentStep(0);
                  setSelectedLesson(-1);
                }

              }}
              className="flex-1"
            >
              {currentStep < lesson.steps.length - 1 ? 'Suivant' : 'Terminer'}
              <ArrowRight className="ml-2" size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}