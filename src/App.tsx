import React, { useEffect, useState } from 'react';
import {
  Friend,
  Memory,
  HeroConfig,
  FinalSceneConfig,
  GroupConfig,
  ChapterInfo,
  ChapterId,
  RandomSnippet,
  RememberedQuote
} from './types';
import {
  getStoredFriends,
  getStoredMemories,
  getStoredVideos,
  getStoredQuotes,
  getStoredSnippets,
  getStoredHeroConfig,
  getStoredFinalSceneConfig,
  getStoredGroupConfig,
  getStoredChapters,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TheThreeOfUs } from './components/TheThreeOfUs';
import { OurStorySection } from './components/OurStorySection';
import { MemoryWall } from './components/MemoryWall';
import { MovingMemories } from './components/MovingMemories';
import { TheRandomStuff } from './components/TheRandomStuff';
import { WordsWeRemember } from './components/WordsWeRemember';
import { TwoMonthsInMotion } from './components/TwoMonthsInMotion';
import { FinalScene } from './components/FinalScene';
import { MemoryLightbox } from './components/MemoryLightbox';
import { PasswordGate } from './components/PasswordGate';

export default function App() {
  // Global Data State
  const [friends, setFriends] = useState<Friend[]>([]);
  const [groupConfig, setGroupConfig] = useState<GroupConfig>(getStoredGroupConfig());
  const [memories, setMemories] = useState<Memory[]>([]);
  const [videos, setVideos] = useState<Memory[]>([]);
  const [quotes, setQuotes] = useState<RememberedQuote[]>([]);
  const [snippets, setSnippets] = useState<RandomSnippet[]>([]);
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(getStoredHeroConfig());
  const [finalSceneConfig, setFinalSceneConfig] = useState<FinalSceneConfig>(getStoredFinalSceneConfig());
  const [chaptersInfo, setChaptersInfo] = useState<Record<ChapterId, ChapterInfo>>(getStoredChapters());

  // Active Lightbox
  const [activeLightboxMemory, setActiveLightboxMemory] = useState<Memory | null>(null);

  // Auth gate
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  // Load all stored state on mount
  useEffect(() => {
    setFriends(getStoredFriends());
    setGroupConfig(getStoredGroupConfig());
    setMemories(getStoredMemories());
    setVideos(getStoredVideos());
    setQuotes(getStoredQuotes());
    setSnippets(getStoredSnippets());
    setHeroConfig(getStoredHeroConfig());
    setFinalSceneConfig(getStoredFinalSceneConfig());
    setChaptersInfo(getStoredChapters());
  }, []);

  const handleEnterMemories = () => {
    const el = document.getElementById('the-three-of-us');
    if (el) {
      try {
        el.scrollIntoView({ behavior: 'smooth' });
      } catch {
        el.scrollIntoView();
      }
    }
  };

  const handleRestart = () => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  const handleNextLightbox = () => {
    if (!activeLightboxMemory || memories.length === 0) return;
    const currentIndex = memories.findIndex((m) => m.id === activeLightboxMemory.id);
    const nextIndex = (currentIndex + 1) % memories.length;
    setActiveLightboxMemory(memories[nextIndex]);
  };

  const handlePrevLightbox = () => {
    if (!activeLightboxMemory || memories.length === 0) return;
    const currentIndex = memories.findIndex((m) => m.id === activeLightboxMemory.id);
    const prevIndex = (currentIndex - 1 + memories.length) % memories.length;
    setActiveLightboxMemory(memories[prevIndex]);
  };

  if (!isUnlocked) {
    return <PasswordGate onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] relative overflow-x-hidden selection:bg-white/20 selection:text-white">
      {/* Film Grain Texture overlay */}
      <div className="fixed inset-0 pointer-events-none film-grain opacity-5 z-30" />

      {/* Floating Glass Navigation */}
      <Navbar />

      <main className="relative z-10 flex flex-col w-full">
        {/* 1. Fullscreen Opening / Hero */}
        <HeroSection
          heroConfig={heroConfig}
          onEnter={handleEnterMemories}
        />

        {/* 2. The Three of Us */}
        <TheThreeOfUs
          friends={friends}
          groupConfig={groupConfig}
        />

        {/* 3. Our Two-Month Story */}
        <OurStorySection
          memories={memories}
          chaptersInfo={chaptersInfo}
          onSelectMemory={(mem) => setActiveLightboxMemory(mem)}
        />

        {/* 4. Extraordinary Editorial Memory Wall */}
        <MemoryWall
          memories={memories}
          onSelectMemory={(mem) => setActiveLightboxMemory(mem)}
        />

        {/* 5. Moving Memories */}
        <MovingMemories videos={videos} />

        {/* 6. The Random Stuff: None of This Was Planned */}
        <TheRandomStuff snippets={snippets} />

        {/* 7. Words We Remember */}
        <WordsWeRemember quotes={quotes} />

        {/* 8. Two Months in Motion (Horizontal Film Reel) */}
        <TwoMonthsInMotion
          memories={memories}
          onSelectMemory={(mem) => setActiveLightboxMemory(mem)}
        />

        {/* 9. Final Emotional Scene */}
        <FinalScene
          config={finalSceneConfig}
          onRestart={handleRestart}
        />
      </main>

      {/* Fullscreen Lightbox with Keyboard Nav */}
      <MemoryLightbox
        memory={activeLightboxMemory}
        onClose={() => setActiveLightboxMemory(null)}
        onNext={handleNextLightbox}
        onPrev={handlePrevLightbox}
      />
    </div>
  );
}
