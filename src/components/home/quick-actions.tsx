import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Play, BookOpen, Trophy } from "lucide-react";
import gamesIcon from "@/assets/games-icon.jpg";
import tutorialsIcon from "@/assets/tutorials-icon.jpg";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgImage?: string;
  onClick: () => void;
}

interface QuickActionsProps {
  onNavigate: (tab: string) => void;
}

export function QuickActions({ onNavigate }: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: 'jeux',
      title: 'Mini-jeux',
      description: 'Défis amusants',
      icon: Gamepad2,
      color: 'bg-gradient-accent',
      bgImage: gamesIcon,
      onClick: () => onNavigate('jeux'),
    },
    {
      id: 'cours',
      title: 'Vidéos & Cours',
      description: 'Apprendre étape par étape',
      icon: Play,
      color: 'bg-gradient-primary',
      bgImage: tutorialsIcon,
      onClick: () => onNavigate('cours'),
    },
    {
      id: 'dictionnaire',
      title: 'Dictionnaire LSF',
      description: 'Rechercher des signes',
      icon: BookOpen,
      color: 'bg-gradient-secondary',
      onClick: () => onNavigate('dictionnaire'),
    },
    {
      id: 'defis',
      title: 'Défis quotidiens',
      description: 'Gagne des badges',
      icon: Trophy,
      color: 'bg-gradient-accent',
      onClick: () => onNavigate('defis'),
    },
  ];

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          
          return (
            <Card 
              key={action.id}
              className="relative overflow-hidden cursor-pointer group hover:scale-[1.02] transition-all duration-300 border shadow-sm"
              onClick={action.onClick}
            >
              <div className="p-6 relative bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="relative z-10">
                  <div className="p-2 bg-primary/10 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={24} className="text-primary" />
                  </div>
                  
                  <h3 className="font-semibold text-sm mb-1 text-foreground">
                    {action.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-xs">
                    {action.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}