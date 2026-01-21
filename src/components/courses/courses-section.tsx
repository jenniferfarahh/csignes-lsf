// src/components/courses/courses-section.tsx
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseCard } from "./course-card";
import { Play, GraduationCap, Clock, Sparkles } from "lucide-react";
import { LessonViewer, LessonStep } from "./LessonViewer";
import {
  loadCourseProgress,
  markLessonCompleted,
  markStepWatched,
  saveCourseProgress,
} from "@/lib/courseProgress";

type LessonItem = {
  id: string; // lesson-1 etc
  number: number;
  title: string;
  description: string;
  estimatedMinutes: number;
};

type ExerciseItem = {
  id: string;
  title: string;
  description: string;
  duration: string;
};

export function CoursesSection() {
  const [activeTab, setActiveTab] = useState<"lessons" | "exercises">("lessons");

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  // ✅ état localStorage
  const [progressState, setProgressState] = useState(() => loadCourseProgress());

  const lessons: LessonItem[] = useMemo(
    () => [
      { id: "lesson-1", number: 1, title: "Bienvenue", description: "Bonjour, ça va ?, oui/non, au revoir.", estimatedMinutes: 7 },
      { id: "lesson-2", number: 2, title: "Émotions", description: "Exprimer joie, fatigue, tristesse…", estimatedMinutes: 8 },
      { id: "lesson-3", number: 3, title: "Alphabet", description: "Épeler un prénom et reconnaître les lettres.", estimatedMinutes: 10 },
      { id: "lesson-4", number: 4, title: "Se présenter", description: "Nom, âge, informations simples.", estimatedMinutes: 9 },
      { id: "lesson-5", number: 5, title: "Loisirs & sports", description: "Parler de ce que tu aimes.", estimatedMinutes: 11 },
      { id: "lesson-6", number: 6, title: "Nourriture", description: "J’ai faim, repas, aliments.", estimatedMinutes: 9 },
      { id: "lesson-7", number: 7, title: "Famille", description: "Père/mère, frère/sœur, enfant…", estimatedMinutes: 8 },
      { id: "lesson-8", number: 8, title: "Verbes essentiels", description: "Aller, venir, vouloir, comprendre…", estimatedMinutes: 10 },
      { id: "lesson-9", number: 9, title: "Jours & demain", description: "Aujourd’hui/demain/hier, semaine.", estimatedMinutes: 10 },
      { id: "lesson-10", number: 10, title: "Nombres 1→10", description: "Compter et répondre vite.", estimatedMinutes: 9 },
      { id: "lesson-11", number: 11, title: "Mois & saisons", description: "Dire une date, une période.", estimatedMinutes: 11 },
      { id: "lesson-12", number: 12, title: "Couleurs", description: "Couleurs + préférences.", estimatedMinutes: 10 },
    ],
    []
  );

  // ✅ “Nouveau” = 3 dernières leçons
  const newLessonIds = useMemo(() => {
    const last3 = lessons.slice(-3).map((l) => l.id);
    return new Set(last3);
  }, [lessons]);

  // ✅ Contenu de chaque leçon: “tous les signes à apprendre”
  // (Tu peux remplacer les videoSrc par tes vraies vidéos /public/videos/xxx.mp4 ou API)
  const lessonStepsMap: Record<string, LessonStep[]> = useMemo(
    () => ({
      "lesson-1": [
        { id: "l1-s1", word: "Bonjour", description: "Saluer poliment", minutes: 2, videoSrc: "/videos/lesson 1/bonjour.mp4" },
        { id: "l1-s2", word: "Ça va ?", description: "Demander comment ça va", minutes: 2, videoSrc: "/videos/cava.mp4" },
        { id: "l1-s3", word: "Au revoir", description: "Prendre congé", minutes: 3, videoSrc: "/videos/aurevoir.mp4" },
      ],
      "lesson-2": [
        { id: "l2-s1", word: "Content", description: "Exprimer la joie", minutes: 3, videoSrc: "/videos/content.mp4" },
        { id: "l2-s2", word: "Fatigué", description: "Exprimer la fatigue", minutes: 3, videoSrc: "/videos/fatigue.mp4" },
        { id: "l2-s3", word: "Triste", description: "Exprimer la tristesse", minutes: 2, videoSrc: "/videos/triste.mp4" },
      ],
      "lesson-3": [
        { id: "l3-s1", word: "Lettre A", description: "Alphabet – A", minutes: 3, videoSrc: "/videos/alphabet-a.mp4" },
        { id: "l3-s2", word: "Lettre B", description: "Alphabet – B", minutes: 3, videoSrc: "/videos/alphabet-b.mp4" },
        { id: "l3-s3", word: "Épeler un prénom", description: "Exemple guidé", minutes: 4, videoSrc: "/videos/epeler.mp4" },
      ],
      // 👉 pour la démo: on met au moins 2-3 signes par leçon
      "lesson-4": [
        { id: "l4-s1", word: "Je m’appelle…", description: "Se présenter", minutes: 4, videoSrc: "/videos/jemappelle.mp4" },
        { id: "l4-s2", word: "Quel âge ?", description: "Demander l’âge", minutes: 2, videoSrc: "/videos/quelage.mp4" },
        { id: "l4-s3", word: "J’ai … ans", description: "Répondre", minutes: 3, videoSrc: "/videos/jaiage.mp4" },
      ],
      "lesson-5": [
        { id: "l5-s1", word: "J’aime", description: "Exprimer un goût", minutes: 3, videoSrc: "/videos/jaime.mp4" },
        { id: "l5-s2", word: "Football", description: "Sport", minutes: 4, videoSrc: "/videos/football.mp4" },
        { id: "l5-s3", word: "Musique", description: "Loisir", minutes: 4, videoSrc: "/videos/musique.mp4" },
      ],
      "lesson-6": [
        { id: "l6-s1", word: "J’ai faim", description: "Exprimer la faim", minutes: 3, videoSrc: "/videos/jaifaim.mp4" },
        { id: "l6-s2", word: "Manger", description: "Action manger", minutes: 3, videoSrc: "/videos/manger.mp4" },
        { id: "l6-s3", word: "Boire", description: "Action boire", minutes: 3, videoSrc: "/videos/boire.mp4" },
      ],
      "lesson-7": [
        { id: "l7-s1", word: "Maman", description: "Famille", minutes: 3, videoSrc: "/videos/maman.mp4" },
        { id: "l7-s2", word: "Papa", description: "Famille", minutes: 3, videoSrc: "/videos/papa.mp4" },
        { id: "l7-s3", word: "Frère/Sœur", description: "Famille", minutes: 2, videoSrc: "/videos/freresoeur.mp4" },
      ],
      "lesson-8": [
        { id: "l8-s1", word: "Aller", description: "Verbe", minutes: 3, videoSrc: "/videos/aller.mp4" },
        { id: "l8-s2", word: "Venir", description: "Verbe", minutes: 3, videoSrc: "/videos/venir.mp4" },
        { id: "l8-s3", word: "Comprendre", description: "Verbe", minutes: 4, videoSrc: "/videos/comprendre.mp4" },
      ],
      "lesson-9": [
        { id: "l9-s1", word: "Aujourd’hui", description: "Temps", minutes: 3, videoSrc: "/videos/aujourdhui.mp4" },
        { id: "l9-s2", word: "Demain", description: "Temps", minutes: 3, videoSrc: "/videos/demain.mp4" },
        { id: "l9-s3", word: "Hier", description: "Temps", minutes: 4, videoSrc: "/videos/hier.mp4" },
      ],
      "lesson-10": [
        { id: "l10-s1", word: "1 à 5", description: "Nombres", minutes: 4, videoSrc: "/videos/nombres-1-5.mp4" },
        { id: "l10-s2", word: "6 à 10", description: "Nombres", minutes: 5, videoSrc: "/videos/nombres-6-10.mp4" },
      ],
      "lesson-11": [
        { id: "l11-s1", word: "Mois", description: "Temporalité", minutes: 5, videoSrc: "/videos/mois.mp4" },
        { id: "l11-s2", word: "Saisons", description: "Temporalité", minutes: 6, videoSrc: "/videos/saisons.mp4" },
      ],
      "lesson-12": [
        { id: "l12-s1", word: "Rouge", description: "Couleur", minutes: 3, videoSrc: "/videos/rouge.mp4" },
        { id: "l12-s2", word: "Bleu", description: "Couleur", minutes: 3, videoSrc: "/videos/bleu.mp4" },
        { id: "l12-s3", word: "Vert", description: "Couleur", minutes: 4, videoSrc: "/videos/vert.mp4" },
      ],
    }),
    []
  );

  const exercises: ExerciseItem[] = useMemo(
    () => [
      { id: "ex-1", title: "Quiz – Salutations", description: "Reconnais bonjour / au revoir.", duration: "3 min" },
      { id: "ex-2", title: "Quiz – Émotions", description: "Associe le bon signe à l’émotion.", duration: "4 min" },
      { id: "ex-3", title: "Quiz – Famille", description: "Maman/papa/frère/sœur…", duration: "4 min" },
    ],
    []
  );

  // ✅ Stats dynamiques
  const completedCount = lessons.filter((l) => !!progressState.completed[l.id]).length;
  const totalLessons = lessons.length;
  const totalMinutes = progressState.totalMinutes ?? 0;

  const stats = [
    { label: "Leçons terminées", value: `${completedCount}/${totalLessons}`, icon: GraduationCap },
    { label: "Minutes étudiées", value: `${totalMinutes} min`, icon: Clock },
    { label: "Niveau", value: "Débutant", icon: Play },
  ];

  // ✅ écran leçon
  if (selectedLessonId) {
    const lesson = lessons.find((l) => l.id === selectedLessonId)!;
    const steps = lessonStepsMap[selectedLessonId] ?? [];
    const watched = progressState.watched?.[selectedLessonId] ?? {};

    return (
      <LessonViewer
        lessonId={lesson.id}
        title={`Leçon ${lesson.number} — ${lesson.title}`}
        steps={steps}
        watched={watched}
        onWatchedStep={(stepId, minutes) => {
          const next = markStepWatched(progressState, selectedLessonId, stepId, minutes);
          setProgressState(next);
          saveCourseProgress(next);
        }}
        onCompleteLesson={() => {
          const next = markLessonCompleted(progressState, selectedLessonId);
          setProgressState(next);
          saveCourseProgress(next);
          setSelectedLessonId(null);
        }}
        onBack={() => setSelectedLessonId(null)}
      />
    );
  }

  return (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Cours & Leçons</h1>
        <p className="text-muted-foreground">Un parcours clair, avec validation vidéo par vidéo.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="p-3 text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="text-primary" size={16} />
                </div>
              </div>
              <p className="font-semibold text-sm">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Leçon du jour (démo) */}
      <Card className="p-4 mb-6 bg-gradient-secondary text-white">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-xl">
            <Sparkles size={22} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Enchaînement recommandé</h3>
            <p className="text-white/90 text-sm">Fais les leçons dans l’ordre : 1 → 12</p>
          </div>
          <Badge className="bg-white/20 text-white border-white/30">Parcours</Badge>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="lessons" className="flex items-center gap-2">
            <Play size={16} />
            Leçons
          </TabsTrigger>
          <TabsTrigger value="exercises" className="flex items-center gap-2">
            <GraduationCap size={16} />
            Exercices
          </TabsTrigger>
        </TabsList>

        {/* Leçons */}
        <TabsContent value="lessons" className="space-y-4">
          {lessons.map((l) => {
            const steps = lessonStepsMap[l.id] ?? [];
            const watched = progressState.watched?.[l.id] ?? {};
            const allWatched = steps.length > 0 && steps.every((s) => watched[s.id]);
            const isCompleted = !!progressState.completed[l.id]; // validé via bouton final
            const showNew = newLessonIds.has(l.id);

            // ✅ Check vert seulement si toutes vidéos vues
            const greenCheck = allWatched;

            return (
              <CourseCard
                key={l.id}
                title={`Leçon ${l.number} — ${l.title}`}
                description={l.description}
                type={"video"}
                duration={`${l.estimatedMinutes} min`}
                progress={isCompleted ? 100 : allWatched ? 90 : 0}
                isCompleted={greenCheck} // ✅ check vert dans UI (si ton CourseCard affiche isCompleted)
                isNew={showNew} // ✅ “Nouveau” sur les 3 dernières
                onStart={() => setSelectedLessonId(l.id)}
              />
            );
          })}
        </TabsContent>

        {/* Exercices */}
        <TabsContent value="exercises" className="space-y-4">
          {exercises.map((ex) => (
            <CourseCard
              key={ex.id}
              title={ex.title}
              description={ex.description}
              type={"exercice"}
              duration={ex.duration}
              progress={0}
              onStart={() => alert("Démo : exercices à brancher si besoin.")}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
