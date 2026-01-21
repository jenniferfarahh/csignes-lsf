import { useState } from "react";
import { MobileNav } from "@/components/ui/mobile-nav";
import { HeroSection } from "@/components/home/hero-section";
import { QuickActions } from "@/components/home/quick-actions";
import { GamesSection } from "@/components/games/games-section";
import { CoursesSection } from "@/components/courses/courses-section";
import { HistorySection } from "@/components/history/history-section";
import { ProfileSection } from "@/components/profile/profile-section";
import { DictionarySection } from "@/components/dictionary/dictionary-section";
import { ChallengesSection } from "@/components/challenges/challenges-section";
import { DailyLesson } from "@/components/lesson/daily-lesson";

// ✅ tes 3 jeux
import { GuessSignGame } from "@/components/games/play/GuessSignGame";
import { MimeGuessGame } from "@/components/games/play/MimeGuessGame";
import { TheoryQuizGame } from "@/components/games/play/TheoryQuizGame";
import { useEffect } from "react";

type GameId = "guess_sign" | "mime_guess" | "quiz_lsf" | "conversation";

const Index = () => {
  const [activeTab, setActiveTab] = useState("accueil");
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const onRefresh = () => setRefreshKey((k) => k + 1);
    window.addEventListener(DASHBOARD_REFRESH_EVENT, onRefresh);
    return () => window.removeEventListener(DASHBOARD_REFRESH_EVENT, onRefresh);
  }, []);

  const renderContent = () => {
    // ✅ si un jeu est actif, on force l’affichage du jeu
    if (activeGame) {
      const common = { onExit: () => setActiveGame(null) };

      switch (activeGame) {
        case "guess_sign":
          return <GuessSignGame {...common} />;
        case "mime_guess":
          return <MimeGuessGame {...common} />;
        case "quiz_lsf":
          return <TheoryQuizGame {...common} />;
        default:
          return <TheoryQuizGame {...common} />;
      }
    }

    switch (activeTab) {
      case "jeux":
        return (
          <GamesSection
            onPlayGame={(id) => {
              setActiveGame(id);
              setActiveTab("jeux");
            }}
          />
        );
      case "dictionnaire":
        return <DictionarySection />;
      case "cours": // ✅ AJOUT
        return <CoursesSection />;
      case "historique":
        return <HistorySection />;
      case "profil":
        return <ProfileSection />;
      case "defis":
        return <ChallengesSection />;
      case "lecon":
        return <DailyLesson onBack={() => setActiveTab("accueil")} />;
      default:
        return (
          <div className="p-4 pb-20">
            <HeroSection onStartLesson={() => setActiveTab("lecon")} />
            <QuickActions onNavigate={setActiveTab} />
          </div>
        );
          }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="relative">{renderContent()}</main>
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
const DASHBOARD_REFRESH_EVENT = "dashboard:refresh";

