import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Video, Star } from "lucide-react";
import { useDictionary } from "@/hooks/useDictionary";

type Difficulty = "facile" | "moyen" | "difficile";

interface Sign {
  id: string;                 // garder string (pas Number)
  word: string;
  description: string;
  category: string;           // ici = nom de la leçon
  difficulty: Difficulty;
  videoUrl?: string;
  isFavorite?: boolean;
}

/**
 * ✅ Catégories = nom des leçons (d’après ton PDF)
 * 
 */
const LESSON_CATEGORIES = [
  "Bienvenue",
  "Ça va ?",
  "Alphabet",
  "Se présenter",
  "Loisirs / Sports",
  "Nourriture",
  "Famille",
  "Nombres (1 à 10)",
  "Couleurs",
  "Verbes importants",
  "Temporalité (proche)",
  "Temporalité (large)",

];

/**
 * ✅ Fallback local (mots des leçons) d’après ton PDF
 * 
 */
const FALLBACK_SIGNS: Sign[] = [
  // Leçon 1
  { id: "l1-bonjour", word: "Bonjour", description: "Salutation utilisée en journée.", category: "Leçon 1 : Bienvenue", difficulty: "facile" },
  { id: "l1-salut", word: "Salut", description: "Salutation informelle.", category: "Leçon 1 : Bienvenue", difficulty: "facile" },
  { id: "l1-ca-va", word: "Ça va ?", description: "Demander comment la personne va.", category: "Leçon 1 : Bienvenue", difficulty: "facile" },
  { id: "l1-oui-et-toi", word: "Oui et toi ?", description: "Répondre et demander en retour.", category: "Leçon 1 : Bienvenue", difficulty: "facile" },
  { id: "l1-non", word: "Non", description: "Refus / négation.", category: "Leçon 1 : Bienvenue", difficulty: "facile" },
  { id: "l1-au-revoir", word: "Au revoir", description: "Pour se quitter.", category: "Leçon 1 : Bienvenue", difficulty: "facile" },
  { id: "l1-a-bientot", word: "À bientôt", description: "À la prochaine fois.", category: "Leçon 1 : Bienvenue", difficulty: "facile" },

  // Leçon 2 (émotions)
  { id: "l2-colere", word: "Colère", description: "Émotion : colère.", category: "Leçon 2 : Ça va ?", difficulty: "facile" },
  { id: "l2-fatigue", word: "Fatigué", description: "État : fatigue.", category: "Leçon 2 : Ça va ?", difficulty: "facile" },
  { id: "l2-joie", word: "Joie", description: "Émotion : joie.", category: "Leçon 2 : Ça va ?", difficulty: "facile" },
  { id: "l2-peur", word: "Peur", description: "Émotion : peur.", category: "Leçon 2 : Ça va ?", difficulty: "facile" },
  { id: "l2-tristesse", word: "Tristesse", description: "Émotion : tristesse.", category: "Leçon 2 : Ça va ?", difficulty: "facile" },

  // Leçon 5 (sports)
  { id: "l5-football", word: "Football", description: "Sport : football.", category: "Leçon 5 : Loisirs / Sports", difficulty: "facile" },
  { id: "l5-tennis", word: "Tennis", description: "Sport : tennis.", category: "Leçon 5 : Loisirs / Sports", difficulty: "facile" },
  { id: "l5-nager", word: "Nager", description: "Activité : nager.", category: "Leçon 5 : Loisirs / Sports", difficulty: "facile" },

  // Leçon 6 (nourriture)
  { id: "l6-jai-faim", word: "J’ai faim", description: "Exprimer la faim.", category: "Leçon 6 : Nourriture", difficulty: "facile" },
  { id: "l6-petit-dej", word: "Petit-déjeuner", description: "Repas du matin.", category: "Leçon 6 : Nourriture", difficulty: "facile" },
  { id: "l6-dejeuner", word: "Déjeuner", description: "Repas du midi.", category: "Leçon 6 : Nourriture", difficulty: "facile" },

  // Leçon 7 (famille)
  { id: "l7-famille", word: "Famille", description: "Thème : famille.", category: "Leçon 7 : Famille", difficulty: "facile" },
  { id: "l7-pere", word: "Père / Papa", description: "Membre de la famille.", category: "Leçon 7 : Famille", difficulty: "facile" },
  { id: "l7-mere", word: "Mère / Maman", description: "Membre de la famille.", category: "Leçon 7 : Famille", difficulty: "facile" },
];

/**
 * Déduplication (anti-doublons) :
 * - clé = word en minuscules
 */
function dedupeByWordCategory(list: Sign[]) {
  const seen = new Set<string>();
  const out: Sign[] = [];
  for (const s of list) {
    const key = `${s.word.trim().toLowerCase()}__${s.category.trim().toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}

type ApiSign = {
  id: string;
  word: string;
  description: string | null;
  category: string;
  difficulty: "facile" | "moyen" | "difficile";
  videoUrl: string;
};

function toUiFromApi(entry: ApiSign): Sign {
  return {
    id: entry.id,
    word: entry.word,
    description: entry.description ?? "",
    category: entry.category,           // ✅ plus de "Leçon 1"
    difficulty: entry.difficulty,
    videoUrl: entry.videoUrl,
    isFavorite: false,
  };
}


interface DictionarySectionProps {
  onBack?: () => void;
}

function formatWord(sign: Sign) {
  // Cas spécial : nombres
  if (sign.category === "Nombres (1 à 10)" && /^\d+$/.test(sign.word)) {
    return `Numéro ${sign.word}`;
  }

  return sign.word;
}


export function DictionarySection({ onBack }: DictionarySectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => new Set());

  const { data: apiDictionary, isLoading, isError } = useDictionary();

  // 1) source: API si dispo sinon fallback local
  const sourceSigns = useMemo(() => {
    const apiSigns = (apiDictionary ?? []).map(toUiFromApi);
    const base = apiSigns.length > 0 ? apiSigns : FALLBACK_SIGNS;

    // appliquer favoris depuis state
    const withFav = base.map((s) => ({
      ...s,
      isFavorite: favoriteIds.has(s.id),
    }));

    // dédup
    return dedupeByWordCategory(withFav);

  }, [apiDictionary, favoriteIds]);

  const categories = useMemo(() => {
    return ["Tous", "Favoris", ...LESSON_CATEGORIES];
  }, []);

  const difficultyOrder: Record<Difficulty, number> = {
  moyen: 0,
  facile: 1,
  difficile: 2,
};


  const filteredSigns = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return sourceSigns
      .filter((sign) => {
        const matchesSearch =
          q.length === 0 ||
          sign.word.toLowerCase().includes(q) ||
          sign.description.toLowerCase().includes(q);

        const matchesCategory =
          selectedCategory === "Tous" ||
          (selectedCategory === "Favoris" && sign.isFavorite) ||
          sign.category === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        // 1️⃣ difficulté (moyen → facile → difficile)
        const diff = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        if (diff !== 0) return diff;

        // 2️⃣ puis ordre alphabétique
        return a.word.localeCompare(b.word, "fr");
      });

  }, [sourceSigns, searchTerm, selectedCategory]);

  const difficultyColors: Record<Difficulty, string> = {
    facile: "bg-success text-success-foreground",
    moyen: "bg-warning text-warning-foreground",
    difficile: "bg-destructive text-destructive-foreground",
  };

  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="p-4 pb-20">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-4">
          ← Retour
        </Button>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Dictionnaire LSF</h1>
        <p className="text-muted-foreground">Recherche et apprends tous les signes de la LSF</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <Input
          placeholder="Rechercher un signe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            className="whitespace-nowrap"
          >
            {cat === "Tous" ? "Tous" : cat === "Favoris" ? "Favoris" : cat}
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

      {/* List */}
      <div className="space-y-4">
        {filteredSigns.length === 0 ? (
          <Card className="p-8 text-center">
            <BookOpen className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h3 className="font-semibold mb-2">Aucun signe trouvé</h3>
            <p className="text-muted-foreground">Essayez avec d'autres mots-clés</p>
          </Card>
        ) : (
          filteredSigns.map((sign) => (
            // ✅ hover enlevé ici (pas de hover:shadow, pas de scale, etc.)
            <Card key={sign.id} className="p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{formatWord(sign)}</h3>
                    {sign.isFavorite && (
                      <Star className="text-warning" size={16} fill="currentColor" />
                    )}
                  </div>

                  <p className="text-muted-foreground text-sm mb-2">{sign.description}</p>

                  <div className="flex flex-wrap gap-2">
                    <Badge className={difficultyColors[sign.difficulty]} variant="secondary">
                      {sign.difficulty}
                    </Badge>
                    <Badge variant="outline">{sign.category}</Badge>
                  </div>
                </div>

                {/* ⭐ Favoris */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(sign.id)}
                  aria-label="Favori"
                >
                  <Star
                    size={18}
                    className={
                      sign.isFavorite ? "text-warning fill-current" : "text-muted-foreground"
                    }
                  />
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => console.log(`Voir le signe: ${sign.word}`)}
              >
                <Video className="mr-2" size={16} />
                Voir le signe
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
