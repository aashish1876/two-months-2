import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Compass, Users, BookOpen, Camera, Film, Volume2, VolumeX, Music } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showMusicPrompt, setShowMusicPrompt] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check if the song is currently playing and reflect it in state.
  useEffect(() => {
    const id = window.setInterval(() => {
      const audio = audioRef.current;
      if (audio) {
        const playing = !audio.paused && !audio.ended;
        setIsPlaying(playing);
      }
    }, 500);

    // If a song is already playing (set up by the gate), adopt it.
    const existing = document.querySelector('audio[data-track="capsule"]') as HTMLAudioElement | null;
    if (existing) {
      audioRef.current = existing;
      setIsPlaying(!existing.paused);
    } else {
      // Build the audio element here for the user-gesture play() call.
      const a = new Audio('/nightchanges.mp3');
      a.loop = true;
      a.volume = 0.55;
      a.preload = 'auto';
      a.setAttribute('data-track', 'capsule');
      audioRef.current = a;
    }

    return () => {
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);

      const sections = ['home', 'the-three-of-us', 'our-story', 'photos', 'videos'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSong = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      const p = audio.play();
      if (p && typeof p.then === 'function') {
        p.then(() => setIsPlaying(true)).catch((err) => {
          console.warn('Audio play blocked:', err);
        });
      }
      setShowMusicPrompt(false);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const startSong = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const p = audio.play();
    if (p && typeof p.then === 'function') {
      p.then(() => {
        setIsPlaying(true);
        setShowMusicPrompt(false);
      }).catch((err) => {
        console.warn('Audio play blocked:', err);
      });
    }
  };

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      try {
        element.scrollIntoView({ behavior: 'smooth' });
      } catch {
        element.scrollIntoView();
      }
    }
  };

  const navItems = [
    { id: 'home', label: 'HOME', icon: Compass },
    { id: 'the-three-of-us', label: 'THE THREE OF US', icon: Users },
    { id: 'our-story', label: 'OUR STORY', icon: BookOpen },
    { id: 'photos', label: 'PHOTOS', icon: Camera },
    { id: 'videos', label: 'VIDEOS', icon: Film },
  ];

  return (
    <>
      {/* Floating music prompt that appears if autoplay was blocked */}
      {showMusicPrompt && !isPlaying && (
        <button
          onClick={startSong}
          className="fixed bottom-6 right-6 z-50 glass-panel border border-amber-300/30 text-amber-200 hover:text-black hover:bg-amber-300 transition-all duration-300 px-5 py-3 text-[10px] tracking-widest uppercase font-mono flex items-center gap-2 shadow-2xl"
        >
          <Music className="w-3.5 h-3.5" />
          <span>Tap to start the soundtrack</span>
        </button>
      )}

      {/* Desktop Floating Glass Navigation Bar */}
      <header
        id="main-navigation"
        className={`fixed top-5 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 w-[94%] max-w-5xl ${
          isScrolled ? 'top-3' : 'top-6'
        }`}
      >
        <div className="glass rounded-full px-5 sm:px-8 py-3 flex items-center justify-between shadow-2xl border border-white/10 text-[#F5F5F5]">
          {/* Logo / Editorial Headline */}
          <button
            onClick={() => scrollTo('home')}
            className="flex items-center gap-2 text-left group focus:outline-none"
          >
            <div className="text-sm font-bold tracking-super-wide opacity-80 hover:opacity-100 transition-opacity uppercase font-sans">
              02 / MONTHS
            </div>
          </button>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-[10px] tracking-widest uppercase font-medium text-neutral-300">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`transition-opacity duration-300 ${
                    isActive
                      ? 'text-white opacity-100 font-semibold'
                      : 'opacity-50 hover:opacity-100 text-neutral-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            <div className="text-xs tracking-widest opacity-60 font-sans uppercase hidden xl:block mr-2">
              JUNE &mdash; AUGUST
            </div>

            {/* Music toggle */}
            <button
              onClick={toggleSong}
              title={isPlaying ? 'Pause soundtrack' : 'Play soundtrack'}
              className={`p-2 rounded-full border transition-all duration-300 ${
                isPlaying
                  ? 'bg-white/15 text-white border-white/30'
                  : 'bg-white/5 text-neutral-400 hover:text-white border-white/10 hover:bg-white/10'
              }`}
            >
              {isPlaying ? (
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-white/5 text-neutral-300 border border-white/10 hover:bg-white/10"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 p-4 glass-panel rounded-2xl border border-white/10 shadow-2xl flex flex-col gap-2 backdrop-blur-3xl animate-in fade-in slide-in-from-top-3 duration-300">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs tracking-wider uppercase transition-all ${
                  activeSection === item.id
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 mt-2 border-t border-white/10">
              <button
                onClick={toggleSong}
                className="w-full text-left px-4 py-2.5 rounded-xl text-xs tracking-wider uppercase transition-all text-neutral-300 hover:text-white hover:bg-white/5 flex items-center justify-between"
              >
                <span>{isPlaying ? 'Pause Soundtrack' : 'Play Soundtrack'}</span>
                {isPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Floating Bottom Bar for Quick Thumb Actions */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm">
        <div className="glass-panel px-4 py-2 rounded-full flex items-center justify-around border border-white/15 shadow-2xl backdrop-blur-2xl">
          <button
            onClick={() => scrollTo('the-three-of-us')}
            className="p-2 text-neutral-400 hover:text-white flex flex-col items-center gap-0.5 text-[9px] tracking-wider uppercase"
          >
            <Users className="w-4 h-4" />
            <span>US</span>
          </button>
          <button
            onClick={() => scrollTo('our-story')}
            className="p-2 text-neutral-400 hover:text-white flex flex-col items-center gap-0.5 text-[9px] tracking-wider uppercase"
          >
            <BookOpen className="w-4 h-4" />
            <span>STORY</span>
          </button>
          <button
            onClick={toggleSong}
            className={`p-2.5 -my-2 rounded-full flex flex-col items-center gap-0.5 text-[9px] font-bold tracking-wider uppercase transition-all ${
              isPlaying
                ? 'bg-gradient-to-tr from-amber-500 to-amber-300 text-black shadow-lg shadow-amber-500/30'
                : 'bg-white/10 text-white border border-white/15'
            }`}
            title={isPlaying ? 'Pause soundtrack' : 'Play soundtrack'}
          >
            {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => scrollTo('photos')}
            className="p-2 text-neutral-400 hover:text-white flex flex-col items-center gap-0.5 text-[9px] tracking-wider uppercase"
          >
            <Camera className="w-4 h-4" />
            <span>WALL</span>
          </button>
          <button
            onClick={() => scrollTo('videos')}
            className="p-2 text-neutral-400 hover:text-white flex flex-col items-center gap-0.5 text-[9px] tracking-wider uppercase"
          >
            <Film className="w-4 h-4" />
            <span>VIDEOS</span>
          </button>
        </div>
      </div>
    </>
  );
};
