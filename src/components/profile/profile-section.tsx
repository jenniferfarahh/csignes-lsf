import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Edit, Share2, Award, User, Mail, Calendar } from "lucide-react";
import { EditProfile } from "./edit-profile";
import { Settings as SettingsView } from "./settings";
import { useToast } from "@/hooks/use-toast";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/auth/AuthContext";

import { Lock } from "lucide-react";

type BadgeDef = {
  id: string;
  name: string;
  description: string;
  color: string; // cercle
  unlock: {
    xp?: number;
    coursesCompleted?: number;
    level?: number;
  };
};

const LOCKED_BADGE_COLORS = [
  "bg-red-300",
  "bg-blue-300",
  "bg-orange-300",
  "bg-green-300",
];


function isUnlocked(b: BadgeDef, stats: { xp: number; coursesCompleted: number; level: number }) {
  const u = b.unlock;
  if (u.level != null && stats.level < u.level) return false;
  if (u.xp != null && stats.xp < u.xp) return false;
  if (u.coursesCompleted != null && stats.coursesCompleted < u.coursesCompleted) return false;
  return true;
}

function unlockLabel(b: BadgeDef) {
  const u = b.unlock;
  if (u.coursesCompleted != null) return `${u.coursesCompleted} cours`;
  if (u.xp != null) return `${u.xp} pts`;
  if (u.level != null) return `Niveau ${u.level}`;
  return "";
}

const BADGES: BadgeDef[] = [
  { id: "first_step", name: "Premier pas", description: "Terminer 1 cours.", color: "bg-success", unlock: { coursesCompleted: 1 } },
  { id: "alphabet", name: "Alphabet maîtrisé", description: "Atteindre 50 pts.", color: "bg-primary", unlock: { xp: 50 } },
  { id: "regular_player", name: "Joueur régulier", description: "Atteindre 30 pts.", color: "bg-warning", unlock: { xp: 30 } },
  { id: "assidu", name: "Étudiant assidu", description: "Atteindre le niveau 3.", color: "bg-accent", unlock: { level: 3 } },
];

export function ProfileSection() {
  const { toast } = useToast();
  const [view, setView] = useState<"main" | "edit" | "settings">("main");

  const { user } = useAuth();
  const userId = user?.id ?? "";

  // Progression réelle (au lieu de "demo")
  const { data: progress, isLoading, isError } = useProgress();
  

  if (view === "edit") {
    return <EditProfile onBack={() => setView("main")} />;
  }

  if (view === "settings") {
    return <SettingsView onBack={() => setView("main")} />;
  }

  // Informations utilisateur depuis Google (/api/me via AuthContext)
  const fullName = useMemo(() => {
    const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
    return name || "Utilisateur";
  }, [user]);

  const email = user?.email ?? "";

  const initials = useMemo(() => {
    const f = (user?.firstName?.trim()?.[0] ?? "U").toUpperCase();
    const l = (user?.lastName?.trim()?.[0] ?? "").toUpperCase();
    return `${f}${l}`;
  }, [user]);

  // Stats depuis la progression
  const xp = progress?.xp ?? 0;
  const coursesCompleted = progress?.completedLessons?.length ?? 0;

  // Niveau (simple): 100 XP = +1 niveau
  const levelNumber = 1 + Math.floor(xp / 100);
  const levelLabel = levelNumber === 1 ? "Débutant" : `Intermédiaire`;

  const computedBadges = useMemo(() => {
    const statsForBadges = { xp, coursesCompleted, level: levelNumber };

    return BADGES
      .map((b) => ({
        ...b,
        unlocked: isUnlocked(b, statsForBadges),
        unlockText: unlockLabel(b),
      }))
      // ✅ unlocked d'abord
      .sort((a, b) => Number(b.unlocked) - Number(a.unlocked));
  }, [xp, coursesCompleted, levelNumber]);

  const unlockedCount = computedBadges.filter(b => b.unlocked).length;

  const stats = [
    { label: "Cours terminés", value: coursesCompleted, icon: Award },
    { label: "Niveau", value: levelNumber, icon: User },
    { label: "Points totaux", value: xp, icon: Award },
  ];

  return (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Mon Profil</h1>
        <p className="text-muted-foreground">Gérer mes informations et mes préférences</p>
      </div>

      {isLoading && (
        <Card className="p-4 mb-4">
          <p className="text-sm text-muted-foreground">Chargement de la progression...</p>
        </Card>
      )}

      {isError && (
        <Card className="p-4 mb-4">
          <p className="text-sm text-destructive">
            Impossible de charger la progression depuis l’API.
          </p>
        </Card>
      )}

      {/* User Info Card */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          <Avatar className="w-16 h-16">
            {user?.picture ? <AvatarImage src={user.picture} alt="Avatar" /> : null}
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h2 className="text-xl font-semibold">{fullName}</h2>
            <p className="text-muted-foreground text-sm">{email}</p>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs sm:text-sm">
                {levelLabel}
              </Badge>
              <Badge className="bg-primary text-primary-foreground text-xs sm:text-sm">
                {xp} pts
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>Inscrit(e)</span>
          </div>
          <div className="flex items-center gap-1">
            <Award size={14} />
            {unlockedCount} badges
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
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
                {stat.label}
              </p>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {computedBadges.map((b, index) => {
            const locked = !b.unlocked;

            return (
              <div
                key={b.id}
                className={[
                  "relative flex items-center gap-3 p-3 rounded-xl overflow-hidden transition",
                  locked ? "bg-muted/20 opacity-80" : "bg-muted/30",
                ].join(" ")}
              >

                {/* overlay lock */}
                {locked && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px]" />
                )}

                  <div
                    className={[
                      "w-10 h-10 rounded-full flex items-center justify-center relative z-10",
                      locked
                        ? LOCKED_BADGE_COLORS[index % LOCKED_BADGE_COLORS.length]
                        : b.color,
                    ].join(" ")}
                  >

                  {locked ? <Lock size={16} className="text-muted-foreground" /> : <Award size={16} className="text-white" />}
                </div>

                <div className="relative z-10">
                  <p className="font-medium text-sm">{b.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {locked ? `Débloquer: ${b.unlockText}` : b.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>


      {/* Quick Actions */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start"
          size="lg"
          onClick={() => setView("settings")}
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
