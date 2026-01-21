import { PrismaClient } from "@prisma/client";
import { prisma } from "../src/prisma";

type SignInput = {
  word: string;
  category: string;
  difficulty: "facile" | "moyen" | "difficile";
  description?: string;
  videoUrl?: string | null;
};

function uniqByWordCategory(signs: SignInput[]) {
  const seen = new Set<string>();
  const out: SignInput[] = [];
  for (const s of signs) {
    const key = `${s.word.trim().toLowerCase()}__${s.category.trim().toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}

async function main() {
  const signs: SignInput[] = [
    // Leçon 1 : Bienvenue
    { word: "Salut", category: "Bienvenue", difficulty: "facile" },
    { word: "Bonjour", category: "Bienvenue", difficulty: "facile" },
    { word: "Ça va ?", category: "Bienvenue", difficulty: "facile" },
    { word: "Oui et toi ?", category: "Bienvenue", difficulty: "facile" },
    { word: "Non", category: "Bienvenue", difficulty: "facile" },
    { word: "Au revoir", category: "Bienvenue", difficulty: "facile" },
    { word: "À bientôt", category: "Bienvenue", difficulty: "facile" },
    { word: "Bisous", category: "Bienvenue", difficulty: "facile" },
    { word: "Je t’aime", category: "Bienvenue", difficulty: "facile" },
    { word: "Comment tu t’appelles ?", category: "Bienvenue", difficulty: "facile" },
    // Leçon 2 : Ça va ?
    { word: "Colère", category: "Ça va ?", difficulty: "facile" },
    { word: "Courage", category: "Ça va ?", difficulty: "facile" },
    { word: "Egoïste", category: "Ça va ?", difficulty: "facile" },
    { word: "Ému", category: "Ça va ?", difficulty: "facile" },
    { word: "Fatigué", category: "Ça va ?", difficulty: "facile" },
    { word: "Jaloux", category: "Ça va ?", difficulty: "facile" },
    { word: "Joie", category: "Ça va ?", difficulty: "facile" },
    { word: "Peur", category: "Ça va ?", difficulty: "facile" },
    { word: "Surprise", category: "Ça va ?", difficulty: "facile" },
    { word: "Tristesse", category: "Ça va ?", difficulty: "facile" },
    { word: "Les pronoms personnels", category: "Ça va ?", difficulty: "facile" },
    { word: "Je vais bien", category: "Ça va ?", difficulty: "facile" },
    { word: "Je suis triste", category: "Ça va ?", difficulty: "facile" },
    { word: "Je suis fatigué", category: "Ça va ?", difficulty: "facile" },
    { word: "Je suis malade", category: "Ça va ?", difficulty: "facile" },
    { word: "Je suis content", category: "Ça va ?", difficulty: "facile" },
    { word: "Je suis heureux", category: "Ça va ?", difficulty: "facile" },

    // Leçon 3 : Alphabet
    { word: "Lettre A ", category: "Alphabet", difficulty: "facile" },

    // Leçon 4 : Se présenter
    { word: "Bonjour", category: "Se présenter", difficulty: "facile" },
    { word: "Comment tu t’appelles ?", category: "Se présenter", difficulty: "facile" },
    { word: "Je m’appelle XXX", category: "Se présenter", difficulty: "facile" },
    { word: "J’ai 1 an", category: "Se présenter", difficulty: "facile" },
    { word: "J’ai 2 ans", category: "Se présenter", difficulty: "facile" },
    { word: "J’ai 3 ans", category: "Se présenter", difficulty: "facile" },
    { word: "Je suis vieux", category: "Se présenter", difficulty: "facile" },
    { word: "Je suis jeune", category: "Se présenter", difficulty: "facile" },

    // Leçon 5 : Loisirs / Sports
    { word: "Badminton", category: "Loisirs / Sports", difficulty: "facile" },
    { word: "Basketball", category: "Loisirs / Sports", difficulty: "facile" },
    { word: "Courir", category: "Loisirs / Sports", difficulty: "facile" },
    { word: "Course", category: "Loisirs / Sports", difficulty: "facile" },
    { word: "Escalade", category: "Loisirs / Sports", difficulty: "facile" },
    { word: "Football", category: "Loisirs / Sports", difficulty: "facile" },
    { word: "Golf", category: "Loisirs / Sports", difficulty: "facile" },
    { word: "Handball", category: "Loisirs / Sports", difficulty: "facile" },
    { word: "Je joue au tennis", category: "Loisirs / Sports", difficulty: "facile" },
    { word: "Tennis", category: "Loisirs / Sports", difficulty: "facile" },
    { word: "Jouer", category: "Loisirs / Sports", difficulty: "facile" },
    { word: "Nager", category: "Loisirs / Sports", difficulty: "facile" },
    { word: "Rugby", category: "Loisirs / Sports", difficulty: "facile" },
    { word: "Volleyball", category: "Loisirs / Sports", difficulty: "facile" },

    // Leçon 6 : Nourriture
    { word: "J’ai faim", category: "Nourriture", difficulty: "facile" },
    { word: "Petit-déjeuner", category: "Nourriture", difficulty: "facile" },
    { word: "Déjeuner", category: "Nourriture", difficulty: "facile" },
    { word: "Fruit", category: "Nourriture", difficulty: "facile" },
    { word: "Légume", category: "Nourriture", difficulty: "facile" },

    // Leçon 7 : Famille
    { word: "Famille", category: "Famille", difficulty: "facile" },
    { word: "Enfant", category: "Famille", difficulty: "facile" },
    { word: "Fille", category: "Famille", difficulty: "facile" },
    { word: "Fils", category: "Famille", difficulty: "facile" },
    { word: "Frère", category: "Famille", difficulty: "facile" },
    { word: "Sœur", category: "Famille", difficulty: "facile" },
    { word: "Parent", category: "Famille", difficulty: "facile" },
    { word: "Père / Papa", category: "Famille", difficulty: "facile" },
    { word: "Mère / Maman", category: "Famille", difficulty: "facile" },

    // Leçon 8 : Verbes importants
    { word: "Aller", category: "Verbes importants", difficulty: "facile" },
    { word: "Venir", category: "Verbes importants", difficulty: "facile" },
    { word: "Faire", category: "Verbes importants", difficulty: "facile" },
    { word: "Voir", category: "Verbes importants", difficulty: "facile" },
    { word: "Entendre (concept)", category: "Verbes importants", difficulty: "facile" },
    { word: "Comprendre", category: "Verbes importants", difficulty: "facile" },
    { word: "Vouloir", category: "Verbes importants", difficulty: "facile" },
    { word: "Pouvoir", category: "Verbes importants", difficulty: "facile" },

    // Leçon 9 : Temporalité (proche)
    { word: "Jour", category: "Temporalité (proche)", difficulty: "facile" },
    { word: "Semaine", category: "Temporalité (proche)", difficulty: "facile" },
    { word: "Lundi", category: "Temporalité (proche)", difficulty: "facile" },
    { word: "Mardi", category: "Temporalité (proche)", difficulty: "facile" },
    { word: "Mercredi", category: "Temporalité (proche)", difficulty: "facile" },
    { word: "Jeudi", category: "Temporalité (proche)", difficulty: "facile" },
    { word: "Vendredi", category: "Temporalité (proche)", difficulty: "facile" },
    { word: "Samedi", category: "Temporalité (proche)", difficulty: "facile" },
    { word: "Dimanche", category: "Temporalité (proche)", difficulty: "facile" },
    { word: "Aujourd’hui", category: "Temporalité (proche)", difficulty: "facile" },
    { word: "Demain", category: "Temporalité (proche)", difficulty: "facile" },
    { word: "Hier", category: "Temporalité (proche)", difficulty: "facile" },

    // Leçon 10 : Nombres (1 à 10)
    ...Array.from({ length: 10 }, (_, i) => ({
      word: String(i + 1),
      category: "Nombres (1 à 10)",
      difficulty: "facile" as const,
    })),

    // Leçon 11 : Temporalité (large)
    { word: "Mois", category: "Temporalité (large)", difficulty: "facile" },
    { word: "Année", category: "Temporalité (large)", difficulty: "facile" },
    { word: "Janvier", category: "Temporalité (large)", difficulty: "facile" },
    { word: "Février", category: "Temporalité (large)", difficulty: "facile" },
    { word: "Mars", category: "Temporalité (large)", difficulty: "facile" },
    { word: "Avril", category: "Temporalité (large)", difficulty: "facile" },
    { word: "Mai", category: "Temporalité (large)", difficulty: "facile" },
    { word: "Juin", category: "Temporalité (large)", difficulty: "facile" },
    { word: "Juillet", category: "Temporalité (large)", difficulty: "facile" },
    { word: "Août", category: "Temporalité (large)", difficulty: "facile" },
    { word: "Septembre", category: "Temporalité (large)", difficulty: "facile" },
    { word: "Octobre", category: "Temporalité (large)", difficulty: "facile" },
    { word: "Novembre", category: "Temporalité (large)", difficulty: "facile" },
    { word: "Décembre", category: "Temporalité (large)", difficulty: "facile" },
    { word: "Saisons", category: "Temporalité (large)", difficulty: "facile" },
    { word: "Dire la date", category: "Temporalité (large)", difficulty: "moyen" },

    // Leçon 12 : Couleurs
    { word: "Couleur", category: "Couleurs", difficulty: "facile" },
    { word: "Blanc", category: "Couleurs", difficulty: "facile" },
    { word: "Noir", category: "Couleurs", difficulty: "facile" },
    { word: "Gris", category: "Couleurs", difficulty: "facile" },
    { word: "Marron", category: "Couleurs", difficulty: "facile" },
    { word: "Bleu", category: "Couleurs", difficulty: "facile" },
    { word: "Jaune", category: "Couleurs", difficulty: "facile" },
    { word: "Vert", category: "Couleurs", difficulty: "facile" },
    { word: "Rouge", category: "Couleurs", difficulty: "facile" },
    { word: "Orange", category: "Couleurs", difficulty: "facile" },
    { word: "Violet", category: "Couleurs", difficulty: "facile" },
    { word: "Pourpre", category: "Couleurs", difficulty: "moyen" },
    { word: "Lilas", category: "Couleurs", difficulty: "moyen" },
    { word: "Taupe", category: "Couleurs", difficulty: "moyen" },
    { word: "Saumon", category: "Couleurs", difficulty: "moyen" },
    { word: "Olive", category: "Couleurs", difficulty: "moyen" },
    { word: "Azur", category: "Couleurs", difficulty: "moyen" },
    { word: "Crème", category: "Couleurs", difficulty: "moyen" },
    { word: "Fuchsia", category: "Couleurs", difficulty: "moyen" },
    { word: "Bordeaux", category: "Couleurs", difficulty: "moyen" },
    { word: "Canari", category: "Couleurs", difficulty: "moyen" },
    { word: "Cendré", category: "Couleurs", difficulty: "moyen" },
    { word: "Brique", category: "Couleurs", difficulty: "moyen" },
    { word: "Pétrole", category: "Couleurs", difficulty: "moyen" },
    { word: "Vermeil", category: "Couleurs", difficulty: "moyen" },
    { word: "Doré", category: "Couleurs", difficulty: "moyen" },
    { word: "Argenté", category: "Couleurs", difficulty: "moyen" },
    { word: "Ma couleur préférée est le ...", category: "Couleurs", difficulty: "facile" },
  ];

    const data = signs.map((s) => ({
    word: s.word,
    category: s.category,
    difficulty: s.difficulty,
    description: s.description ?? null,
    videoUrl: s.videoUrl ?? "/videos/placeholder.mp4",
    }));


  const res = await prisma.sign.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`✅ Import terminé: ${res.count} signes ajoutés (doublons ignorés).`);
}

main()
  .catch((e) => {
    console.error("❌ Import error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
