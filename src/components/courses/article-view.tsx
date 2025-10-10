import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, BookOpen } from "lucide-react";

interface ArticleViewProps {
  onBack: () => void;
}

export function ArticleView({ onBack }: ArticleViewProps) {
  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2" size={20} />
        Retour
      </Button>

      <Card className="p-6">
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge className="bg-secondary text-secondary-foreground">
              <BookOpen size={12} className="mr-1" />
              Article
            </Badge>
            <Badge variant="outline">Débutant</Badge>
            <div className="flex items-center gap-1 text-muted-foreground text-sm ml-auto">
              <Clock size={14} />
              <span>8 min</span>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            Introduction à la Langue des Signes Française
          </h1>

          <p className="text-muted-foreground">
            Par l'équipe CSignes • 15 mars 2024
          </p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>Qu'est-ce que la LSF?</h2>
          <p>
            La Langue des Signes Française (LSF) est une langue visuelle et gestuelle utilisée par 
            la communauté sourde en France. Elle possède sa propre grammaire et sa propre syntaxe, 
            distinctes du français oral.
          </p>

          <h3>Histoire de la LSF</h3>
          <p>
            La LSF a une histoire riche qui remonte au 18ème siècle. L'Abbé de l'Épée, considéré 
            comme le père de la langue des signes française, a créé la première école pour sourds 
            à Paris en 1760.
          </p>

          <h3>Les composantes de la LSF</h3>
          <p>
            La LSF utilise plusieurs éléments pour communiquer :
          </p>
          <ul>
            <li><strong>La configuration de la main</strong> - La forme que prend la main</li>
            <li><strong>L'emplacement</strong> - Où le signe est réalisé dans l'espace</li>
            <li><strong>Le mouvement</strong> - Comment la main se déplace</li>
            <li><strong>L'orientation</strong> - La direction de la paume et des doigts</li>
            <li><strong>L'expression faciale</strong> - Cruciale pour la grammaire et le sens</li>
          </ul>

          <h3>Pourquoi apprendre la LSF?</h3>
          <p>
            Apprendre la LSF offre de nombreux avantages :
          </p>
          <ul>
            <li>Communiquer avec la communauté sourde</li>
            <li>Développer de nouvelles compétences cognitives</li>
            <li>Enrichir votre compréhension de la diversité linguistique</li>
            <li>Ouvrir de nouvelles opportunités professionnelles</li>
          </ul>

          <h3>Commencer votre apprentissage</h3>
          <p>
            Pour débuter en LSF, il est recommandé de :
          </p>
          <ol>
            <li>Apprendre l'alphabet dactylologique (alphabet des signes)</li>
            <li>Maîtriser les signes de base (salutations, politesse)</li>
            <li>Pratiquer régulièrement avec des exercices interactifs</li>
            <li>Regarder des vidéos de locuteurs natifs</li>
            <li>Rejoindre une communauté d'apprentissage</li>
          </ol>

          <p className="mt-8 p-4 bg-primary/10 rounded-lg">
            <strong>Conseil :</strong> La pratique régulière est la clé du succès dans l'apprentissage 
            de la LSF. Essayez de pratiquer au moins 15 minutes par jour avec CSignes !
          </p>
        </div>

        <div className="mt-8 pt-6 border-t">
          <Button onClick={onBack} className="w-full">
            Terminer la lecture
          </Button>
        </div>
      </Card>
    </div>
  );
}
