import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CourseCard } from "./course-card";
import { ArticleView } from "./article-view";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, BookOpen, GraduationCap, Clock } from "lucide-react";
import tutorialsIcon from "@/assets/tutorials-icon.jpg";

export function CoursesSection() {
  const [viewingArticle, setViewingArticle] = useState(false);

  if (viewingArticle) {
    return <ArticleView onBack={() => setViewingArticle(false)} />;
  }
  // Mock course data
  const courses = {
    videos: [
      {
        id: 1,
        title: "Introduction à la LSF",
        description: "Découvre les bases de la Langue des Signes Française",
        type: "video" as const,
        duration: "12 min",
        progress: 100,
        isCompleted: true,
        thumbnail: tutorialsIcon,
      },
      {
        id: 2,
        title: "L'alphabet en LSF",
        description: "Apprends à signer toutes les lettres de l'alphabet",
        type: "video" as const,
        duration: "8 min",
        progress: 65,
      },
      {
        id: 3,
        title: "Salutations et politesse",
        description: "Les expressions de base pour être poli en LSF",
        type: "video" as const,
        duration: "15 min",
        isNew: true,
      },
    ],
    articles: [
      {
        id: 4,
        title: "Histoire de la LSF",
        description: "Découvre l'origine et l'évolution de la langue des signes",
        type: "article" as const,
        duration: "5 min",
        progress: 100,
        isCompleted: true,
      },
      {
        id: 5,
        title: "Culture sourde en France",
        description: "Comprendre la communauté sourde et sa richesse culturelle",
        type: "article" as const,
        duration: "7 min",
      },
    ],
    exercices: [
      {
        id: 6,
        title: "Quiz - Alphabet LSF",
        description: "Teste tes connaissances sur l'alphabet en signes",
        type: "exercice" as const,
        duration: "10 min",
        progress: 45,
        isCompleted: false,
      },
    ],
  };

  const stats = [
    { label: "Vidéos vues", value: "8", icon: Play },
    { label: "Articles lus", value: "12", icon: BookOpen },
    { label: "Heures d'étude", value: "24h", icon: Clock },
  ];

  return (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Cours & Tutoriels
        </h1>
        <p className="text-muted-foreground">
          Apprends la LSF avec nos contenus pédagogiques
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-3 text-center">
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

      {/* Featured Course */}
      <Card className="p-4 mb-6 bg-gradient-secondary text-white">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-xl">
            <GraduationCap size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Cours recommandé</h3>
            <p className="text-white/90 text-sm">
              Continue ton parcours avec "Salutations et politesse"
            </p>
          </div>
          <Badge className="bg-white/20 text-white border-white/30">
            Nouveau
          </Badge>
        </div>
      </Card>

      {/* Course Tabs */}
      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Play size={16} />
            Vidéos
          </TabsTrigger>
          <TabsTrigger value="articles" className="flex items-center gap-2">
            <BookOpen size={16} />
            Articles
          </TabsTrigger>
          <TabsTrigger value="exercices" className="flex items-center gap-2">
            <GraduationCap size={16} />
            Exercices
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="space-y-4">
          {courses.videos.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              description={course.description}
              type={course.type}
              duration={course.duration}
              progress={course.progress}
              isCompleted={course.isCompleted}
              isNew={course.isNew}
              thumbnail={course.thumbnail}
              onStart={() => {
                alert(`Début du cours: ${course.title}`);
              }}
            />
          ))}
        </TabsContent>

        <TabsContent value="articles" className="space-y-4">
          {courses.articles.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              description={course.description}
              type={course.type}
              duration={course.duration}
              progress={course.progress}
              isCompleted={course.isCompleted}
              onStart={() => setViewingArticle(true)}
            />
          ))}
        </TabsContent>

        <TabsContent value="exercices" className="space-y-4">
          {courses.exercices.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              description={course.description}
              type={course.type}
              duration={course.duration}
              progress={course.progress}
              isCompleted={course.isCompleted}
              onStart={() => {
                alert(`Début de l'exercice: ${course.title}`);
              }}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}