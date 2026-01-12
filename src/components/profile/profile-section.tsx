import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings, Edit, Share2, Award, User, Mail, Calendar } from "lucide-react";
import { EditProfile } from "./edit-profile";
import { Settings as SettingsView } from "./settings";
import { useToast } from "@/hooks/use-toast";
import { useProgress } from "@/hooks/useProgress";

export function ProfileSection() {
  const { toast } = useToast();
  const [view, setView] = useState<'main' | 'edit' | 'settings'>('main');
  const { data: progress, isLoading, isError } = useProgress("demo");


  if (view === 'edit') {
    return <EditProfile onBack={() => setView('main')} />;
  }

  if (view === 'settings') {
    return <SettingsView onBack={() => setView('main')} />;
  }
  // Mock user data
  const user = {
    name: "Marie Dubois",
    email: "marie.dubois@email.com",
    joinDate: "Mars 2024",
    level: "Débutant",
    totalPoints: 2450,
    badges: 8,
    coursesCompleted: 12,
    gamesPlayed: 25,
  };

  const totalPoints = progress?.xp ?? user.totalPoints;
  const coursesCompleted = progress?.completedLessons?.length ?? user.coursesCompleted;

  const badges = [
    { name: "Premier pas", color: "bg-success" },
    { name: "Alphabet maîtrisé", color: "bg-primary" },
    { name: "Joueur régulier", color: "bg-warning" },
    { name: "Étudiant assidu", color: "bg-accent" },
  ];

  const stats = [
    { label: "Cours terminés", value: coursesCompleted, icon: Award },
    { label: "Jeux joués", value: user.gamesPlayed, icon: User },
    { label: "Points totaux", value: totalPoints, icon: Mail },
  ];

  return (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Mon Profil
        </h1>
        <p className="text-muted-foreground">
          Gérer mes informations et mes préférences
        </p>
      </div>

      {isLoading && (
        <Card className="p-4 mb-4">
          <p className="text-sm text-muted-foreground">Chargement de la progression...</p>
        </Card>
      )}

      {isError && (
        <Card className="p-4 mb-4">
          <p className="text-sm text-destructive">
            Impossible de charger la progression depuis l’API. (Fallback local)
          </p>
        </Card>
      )}

      {/* User Info Card */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
              MD
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-muted-foreground text-sm">{user.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs sm:text-sm">{user.level}</Badge>
              <Badge className="bg-primary text-primary-foreground text-xs sm:text-sm">
                {totalPoints} pts
              </Badge>
            </div>
          </div>
          
          <Button variant="outline" size="sm" onClick={() => setView('edit')}>
            <Edit size={16} className="sm:mr-2" />
            <span className="hidden sm:inline">Modifier</span>
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span className="hidden sm:inline">Inscrit en </span>{user.joinDate}
          </div>
          <div className="flex items-center gap-1">
            <Award size={14} />
            {user.badges} badges
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-2 sm:p-3 text-center">
              <div className="flex justify-center mb-1 sm:mb-2">
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                  <Icon className="text-primary" size={14} />
                </div>
              </div>
              <p className="font-semibold text-sm sm:text-base">{stat.value}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">{stat.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Badges */}
      <Card className="p-4 mb-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Award size={20} />
          Mes badges
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
              <div className={`w-10 h-10 rounded-full ${badge.color} flex items-center justify-center`}>
                <Award size={16} className="text-white" />
              </div>
              <div>
                <p className="font-medium text-sm">{badge.name}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          size="lg"
          onClick={() => setView('settings')}
        >
          <Settings className="mr-3" size={20} />
          Paramètres de l'app
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          size="lg"
          onClick={() => {
            toast({
              title: "Partage",
              description: "Fonctionnalité de partage disponible prochainement !",
            });
          }}
        >
          <Share2 className="mr-3" size={20} />
          Partager l'application
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          size="lg"
          onClick={() => {
            toast({
              title: "Contact",
              description: "Envoyez-nous un email à contact@csignes.fr",
            });
          }}
        >
          <Mail className="mr-3" size={20} />
          Nous contacter
        </Button>
      </div>
    </div>
  );
}