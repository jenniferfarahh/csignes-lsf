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
import { useProgress } from "@/hooks/useProgress";
import { GuessSignGame } from "@/components/games/play/GuessSignGame";
import { MimeGuessGame } from "@/components/games/play/MimeGuessGame";
import { TheoryQuizGame } from "@/components/games/play/TheoryQuizGame";
import type { GameId } from "@/components/games/games-section";

const Index = () => {
  const [activeTab, setActiveTab] = useState('accueil');
  const { data: progress } = useProgress();
  const [activeGame, setActiveGame] = useState<null | Exclude<GameId, "conversation">>(null);
  const [completedGames, setCompletedGames] = useState<Set<GameId>>(new Set());



  const renderContent = () => {
        if (activeGame) {
      const onExit = (done: boolean) => {
        if (done) {
          setCompletedGames((prev) => new Set(prev).add(activeGame));
        }
        setActiveGame(null);
      };

      switch (activeGame) {
        case "guess_sign":
          return <GuessSignGame onExit={onExit} />;
        case "mime_guess":
          return <MimeGuessGame onExit={onExit} />;
        case "quiz_lsf":
          return <TheoryQuizGame onExit={onExit} />;
      }
    }

    switch (activeTab) {
      case "jeux":
        return (
          <GamesSection
            onPlayGame={setActiveGame}
            completedGames={completedGames}
          />
        );

      case 'dictionnaire':
        return <DictionarySection />;
      case 'historique':
        return <HistorySection />;
      case 'profil':
        return <ProfileSection />;
      case 'defis':
        return <ChallengesSection />;
      case 'lecon':
        return <DailyLesson onBack={() => setActiveTab('accueil')} />;
      default:
        return (
          <div className="p-4 pb-20">
            <HeroSection onStartLesson={() => setActiveTab('lecon')} />
            <QuickActions onNavigate={setActiveTab} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="relative">
        {renderContent()}
      </main>
      
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
