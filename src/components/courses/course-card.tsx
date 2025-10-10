import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Play, Clock, BookOpen, CheckCircle } from "lucide-react";

interface CourseCardProps {
  title: string;
  description: string;
  type: 'video' | 'article' | 'exercice';
  duration: string;
  progress?: number;
  isCompleted?: boolean;
  isNew?: boolean;
  thumbnail?: string;
  onStart: () => void;
}

export function CourseCard({
  title,
  description,
  type,
  duration,
  progress = 0,
  isCompleted = false,
  isNew = false,
  thumbnail,
  onStart,
}: CourseCardProps) {
  const typeConfig = {
    video: { icon: Play, label: 'Vidéo', color: 'bg-primary text-primary-foreground' },
    article: { icon: BookOpen, label: 'Article', color: 'bg-secondary text-secondary-foreground' },
    exercice: { icon: CheckCircle, label: 'Exercice', color: 'bg-accent text-accent-foreground' },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      {/* Thumbnail / Header */}
      <div className="relative h-32 bg-gradient-primary">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
            <Icon className="text-white" size={32} />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={config.color}>
            <Icon size={12} className="mr-1" />
            {config.label}
          </Badge>
          
          {isNew && (
            <Badge className="bg-warning text-warning-foreground">
              Nouveau
            </Badge>
          )}
        </div>

        {/* Progress Ring */}
        {progress > 0 && (
          <div className="absolute top-3 right-3">
            <ProgressRing progress={progress} size={40} strokeWidth={3}>
              {isCompleted ? (
                <CheckCircle size={16} className="text-success" />
              ) : (
                <span className="text-xs font-bold text-white">
                  {progress}%
                </span>
              )}
            </ProgressRing>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock size={14} />
            <span className="text-sm">{duration}</span>
          </div>

          <Button 
            onClick={onStart}
            size="sm"
            className="rounded-xl font-medium"
            variant={isCompleted ? "outline" : "default"}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="mr-1" size={14} />
                Revoir
              </>
            ) : progress > 0 ? (
              'Continuer'
            ) : (
              'Commencer'
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}