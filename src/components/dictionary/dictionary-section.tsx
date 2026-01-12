import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Video, Star, ArrowLeft } from "lucide-react";
import { useDictionary } from "@/hooks/useDictionary";

interface Sign {
  id: number;
  word: string;
  description: string;
  category: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  videoUrl?: string;
  isFavorite?: boolean;
}

interface DictionarySectionProps {
  onBack?: () => void;
}

type Difficulty = "facile" | "moyen" | "difficile";

function toUiSign(entry: { id: string; word: string; videoUrl: string }): Sign {
  return {
    id: Number(entry.id.replace(/\D/g, "")) || 999, // safe conversion
    word: entry.word,
    description: "Entrée depuis l’API",
    category: "salutations",
    difficulty: "facile",
    videoUrl: entry.videoUrl,
    isFavorite: false,
  };
}


export function DictionarySection({ onBack }: DictionarySectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("tous");
  const [signs, setSigns] = useState<Sign[]>([

    {
      id: 1,
      word: "Bonjour",
      description: "Salutation de base pour dire bonjour",
      category: "salutations",
      difficulty: "facile",
      isFavorite: true,
    },
    {
      id: 2,
      word: "Merci",
      description: "Expression de gratitude",
      category: "politesse",
      difficulty: "facile",
    },
    {
      id: 3,
      word: "Famille",
      description: "Concept de famille en LSF",
      category: "famille",
      difficulty: "moyen",
    },
    {
      id: 4,
      word: "Heureux",
      description: "Émotion de joie et bonheur",
      category: "emotions",
      difficulty: "moyen",
    },
  ]);
  const { data: apiDictionary, isLoading, isError } = useDictionary();


  const toggleFavorite = (id: number) => {
    setSigns(signs.map(sign => 
      sign.id === id ? { ...sign, isFavorite: !sign.isFavorite } : sign
    ));
  };

  const categories = [
    { id: "tous", label: "Tous" },
    { id: "favoris", label: "Favoris" },
    { id: "salutations", label: "Salutations" },
    { id: "politesse", label: "Politesse" },
    { id: "famille", label: "Famille" },
    { id: "emotions", label: "Émotions" },
  ];

  const apiSigns: Sign[] = (apiDictionary ?? []).map(toUiSign);

  const sourceSigns = apiSigns.length > 0 ? apiSigns : signs;

  const filteredSigns = sourceSigns.filter(sign => {
    const matchesSearch = sign.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "tous" || 
                           (selectedCategory === "favoris" && sign.isFavorite) ||
                           sign.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const difficultyColors = {
    facile: 'bg-success text-success-foreground',
    moyen: 'bg-warning text-warning-foreground',
    difficile: 'bg-destructive text-destructive-foreground',
  };

  return (
    <div className="p-4 pb-20">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2" size={20} />
          Retour
        </Button>
      )}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Dictionnaire LSF
        </h1>
        <p className="text-muted-foreground">
          Recherche et apprends tous les signes de la LSF
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
        <Input
          placeholder="Rechercher un signe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="whitespace-nowrap"
          >
            {category.label}
          </Button>
        ))}
      </div>

      {isLoading && (
        <Card className="p-4 mb-4">
          <p className="text-sm text-muted-foreground">Chargement du dictionnaire...</p>
        </Card>
      )}

      {isError && (
        <Card className="p-4 mb-4">
          <p className="text-sm text-destructive">
            Impossible de charger le dictionnaire depuis l’API. (Fallback local)
          </p>
        </Card>
      )}

      {/* Signs List */}
      <div className="space-y-4">
        {filteredSigns.length === 0 ? (
          <Card className="p-8 text-center">
            <BookOpen className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h3 className="font-semibold mb-2">Aucun signe trouvé</h3>
            <p className="text-muted-foreground">
              Essayez avec d'autres mots-clés
            </p>
          </Card>
        ) : (
          filteredSigns.map((sign) => (
            <Card key={sign.id} className="p-4 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{sign.word}</h3>
                    {sign.isFavorite && (
                      <Star className="text-warning" size={16} fill="currentColor" />
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mb-2">
                    {sign.description}
                  </p>
                  <div className="flex gap-2">
                    <Badge className={difficultyColors[sign.difficulty]} variant="secondary">
                      {sign.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      {categories.find(c => c.id === sign.category)?.label}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    console.log(`Viewing sign: ${sign.word}`);
                  }}
                >
                  <Video className="mr-2" size={16} />
                  Voir le signe
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(sign.id)}
                >
                  <Star 
                    size={16} 
                    className={sign.isFavorite ? "text-warning fill-current" : "text-muted-foreground"}
                  />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}