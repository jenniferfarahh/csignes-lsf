import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Star, TrendingUp } from "lucide-react";

interface Question {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface LessonResultsProps {
  score: number;
  questions: Question[];
  onReview?: () => void;
}

export function LessonResults({ score, questions, onReview }: LessonResultsProps) {
  const correctCount = questions.filter(q => q.isCorrect).length;
  const totalCount = questions.length;

  return (
    <div className="space-y-4">
      {/* Score Card */}
      <Card className="p-6 text-center">
        <div className="mb-4">
          <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
            <Star size={48} className="text-white" fill="currentColor" />
          </div>
          <h2 className="text-3xl font-bold mb-2">{score}%</h2>
          <p className="text-muted-foreground">
            {correctCount} sur {totalCount} bonnes réponses
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          {score >= 90 && (
            <Badge className="bg-success text-success-foreground">Excellent !</Badge>
          )}
          {score >= 70 && score < 90 && (
            <Badge className="bg-primary text-primary-foreground">Très bien !</Badge>
          )}
          {score >= 50 && score < 70 && (
            <Badge className="bg-warning text-warning-foreground">Bien</Badge>
          )}
          {score < 50 && (
            <Badge variant="outline">Continue à pratiquer</Badge>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <TrendingUp size={16} />
          <span>+{Math.floor(score * 10)} points gagnés</span>
        </div>
      </Card>

      {/* Questions Review */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg px-1">Révision des réponses</h3>
        {questions.map((q, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start gap-3">
              <div className={`mt-1 p-2 rounded-full ${q.isCorrect ? 'bg-success/10' : 'bg-destructive/10'}`}>
                {q.isCorrect ? (
                  <CheckCircle className="text-success" size={20} />
                ) : (
                  <XCircle className="text-destructive" size={20} />
                )}
              </div>
              
              <div className="flex-1">
                <p className="font-medium mb-2">{q.question}</p>
                
                <div className="space-y-1 text-sm">
                  <div className={`flex items-center gap-2 ${q.isCorrect ? 'text-success' : 'text-destructive'}`}>
                    <span className="font-medium">Votre réponse:</span>
                    <span>{q.userAnswer}</span>
                  </div>
                  
                  {!q.isCorrect && (
                    <div className="flex items-center gap-2 text-success">
                      <span className="font-medium">Réponse correcte:</span>
                      <span>{q.correctAnswer}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {onReview && (
        <Button variant="outline" className="w-full" onClick={onReview}>
          Reprendre cette leçon
        </Button>
      )}
    </div>
  );
}
