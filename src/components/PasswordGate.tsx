import React, { useEffect, useState, useRef } from 'react';
import { Lock, Delete, Sparkles, Music, Music2 } from 'lucide-react';
import { motion } from 'motion/react';

const CORRECT_PASSWORD = '2500090213';
const MAX_LENGTH = CORRECT_PASSWORD.length;

interface PasswordGateProps {
  onUnlock: () => void;
}

export const PasswordGate: React.FC<PasswordGateProps> = ({ onUnlock }) => {
  const [digits, setDigits] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [shake, setShake] = useState<number>(0);
  const [needsPlayConfirm, setNeedsPlayConfirm] = useState<boolean>(false);

  // Audio is created lazily inside the click handler so the first user
  // gesture is preserved all the way through to play().
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getOrCreateAudio = (): HTMLAudioElement => {
    if (audioRef.current) return audioRef.current;

    // Reuse the same audio element that the Navbar may have created.
    const existing = document.querySelector('audio[data-track="capsule"]') as HTMLAudioElement | null;
    if (existing) {
      audioRef.current = existing;
      return existing;
    }

    const audio = new Audio('/nightchanges.mp3');
    audio.loop = true;
    audio.volume = 0.55;
    audio.preload = 'auto';
    audio.setAttribute('data-track', 'capsule');
    audioRef.current = audio;
    return audio;
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const startSong = (): boolean => {
    const audio = getOrCreateAudio();
    try {
      audio.currentTime = 0;
      const p = audio.play();
      if (p && typeof p.then === 'function') {
        p.catch((err) => {
          console.warn('Audio play blocked:', err);
        });
      }
      return true;
    } catch (err) {
      console.warn('Audio play threw:', err);
      return false;
    }
  };

  const tryUnlock = (entered: string) => {
    if (entered === CORRECT_PASSWORD) {
      // Call play() synchronously inside the click handler stack so the
      // browser keeps the user-gesture flag. This is the most important
      // detail — calling play() later (in setTimeout / useEffect) often
      // gets rejected as "not a user gesture".
      const started = startSong();

      if (!started) {
        setNeedsPlayConfirm(true);
        return;
      }

      // If the audio is actually playing, unlock. Otherwise surface a
      // "tap to start music" state so the user can re-trigger with an
      // explicit click.
      const audio = audioRef.current;
      if (audio) {
        const onPlaying = () => {
          audio.removeEventListener('playing', onPlaying);
          window.setTimeout(() => onUnlock(), 250);
        };
        audio.addEventListener('playing', onPlaying);
        // Safety net in case 'playing' never fires (audio already loaded
        // and is in a paused state for some reason).
        window.setTimeout(() => {
          if (!audio.paused) {
            onUnlock();
          } else if (!needsPlayConfirm) {
            // Audio didn't start — show the confirm button.
            setNeedsPlayConfirm(true);
          }
        }, 600);
      } else {
        window.setTimeout(() => onUnlock(), 250);
      }
    } else {
      setError(true);
      setShake((n) => n + 1);
      window.setTimeout(() => {
        setDigits('');
        setError(false);
      }, 700);
    }
  };

  const press = (digit: string) => {
    if (digits.length >= MAX_LENGTH) return;
    const next = digits + digit;
    setError(false);
    setDigits(next);
    if (next.length === MAX_LENGTH) {
      // Auto-evaluate the moment the final digit lands.
      tryUnlock(next);
    }
  };

  const backspace = () => {
    if (digits.length === 0) return;
    setError(false);
    setDigits((prev) => prev.slice(0, -1));
  };

  const clear = () => {
    setError(false);
    setDigits('');
  };

  const confirmStartSong = () => {
    const started = startSong();
    if (started) {
      setNeedsPlayConfirm(false);
      window.setTimeout(() => onUnlock(), 250);
    }
  };

  const keys: (string | 'back' | 'clear')[] = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    'clear', '0', 'back',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 overflow-hidden bg-[#050505]">
      {/* Ambient backdrop layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-white/[0.05] rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-amber-500/[0.04] rounded-full blur-[160px]" />
        <div className="absolute inset-0 film-grain opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,5,0.85)_100%)]" />
      </div>

      <motion.div
        key={shake}
        initial={{ x: 0 }}
        animate={error ? { x: [-12, 12, -10, 10, -6, 6, 0] } : { x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Editorial label above the glass card */}
        <div className="text-center mb-8">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[10px] tracking-super-wide opacity-50 uppercase font-mono mb-3 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3 h-3" />
            <span>Two Months &bull; A Private Capsule</span>
            <Sparkles className="w-3 h-3" />
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-light text-[#F5F5F5] tracking-tight"
          >
            ENTER THE CODE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-3 text-[10px] sm:text-xs tracking-widest uppercase opacity-50 font-sans max-w-xs mx-auto"
          >
            Only the three of us know this number.
          </motion.p>
        </div>

        {/* Glassy keypad card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="relative"
        >
          {/* Soft outer glow */}
          <div className="absolute -inset-px bg-gradient-to-b from-white/10 via-white/5 to-transparent rounded-none pointer-events-none blur-sm" />

          <div className="relative glass-panel p-7 sm:p-10 border border-white/15 shadow-[0_30px_80px_-20px_rgba(255,255,255,0.08)] backdrop-blur-2xl">
            {/* Lock emblem */}
            <div className="flex items-center justify-center mb-7">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
                <div className="relative p-4 rounded-full bg-gradient-to-b from-white/15 to-white/5 border border-white/20 backdrop-blur-xl shadow-inner">
                  <Lock className="w-5 h-5 text-white/90" />
                </div>
              </div>
            </div>

            {/* Dots showing entered digits */}
            <div className="flex items-center justify-center gap-2.5 mb-5 min-h-[14px]">
              {Array.from({ length: MAX_LENGTH }).map((_, i) => {
                const filled = i < digits.length;
                return (
                  <motion.span
                    key={i}
                    initial={false}
                    animate={{
                      scale: filled ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.18 }}
                    className={`w-2.5 h-2.5 rounded-full border transition-all duration-200 ${
                      filled
                        ? error
                          ? 'bg-red-400 border-red-400 shadow-[0_0_10px_rgba(248,113,113,0.6)]'
                          : 'bg-white border-white shadow-[0_0_12px_rgba(255,255,255,0.7)]'
                        : 'bg-transparent border-white/25'
                    }`}
                  />
                );
              })}
            </div>

            {/* Status line */}
            <div className="text-center mb-6 h-5">
              {error ? (
                <p className="text-[10px] tracking-widest uppercase text-red-400/90 font-mono">
                  That isn&apos;t it. Try again.
                </p>
              ) : needsPlayConfirm ? (
                <p className="text-[10px] tracking-widest uppercase text-amber-300/90 font-mono">
                  Tap below to start the soundtrack.
                </p>
              ) : digits.length === 0 ? (
                <p className="text-[10px] tracking-widest uppercase opacity-40 font-mono">
                  {MAX_LENGTH} digits
                </p>
              ) : (
                <p className="text-[10px] tracking-widest uppercase opacity-50 font-mono">
                  {digits.length} / {MAX_LENGTH}
                </p>
              )}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-3 sm:gap-3.5">
              {keys.map((k) => {
                if (k === 'back') {
                  return (
                    <button
                      key="back"
                      onClick={backspace}
                      disabled={digits.length === 0}
                      className="aspect-square glass-button border border-white/10 text-white transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center group"
                      aria-label="Delete last digit"
                    >
                      <Delete className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>
                  );
                }
                if (k === 'clear') {
                  return (
                    <button
                      key="clear"
                      onClick={clear}
                      disabled={digits.length === 0}
                      className="aspect-square glass-button border border-white/10 text-white/80 transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-[10px] tracking-widest uppercase font-mono"
                      aria-label="Clear all"
                    >
                      Clear
                    </button>
                  );
                }
                return (
                  <button
                    key={k}
                    onClick={() => press(k)}
                    className="aspect-square glass-button border border-white/10 text-white text-2xl sm:text-3xl font-light transition-all duration-200 cursor-pointer hover:scale-[1.03] active:scale-95"
                    aria-label={`Digit ${k}`}
                  >
                    {k}
                  </button>
                );
              })}
            </div>

            {/* Confirm-play fallback button (only shown if browser blocks autoplay) */}
            {needsPlayConfirm && (
              <button
                onClick={confirmStartSong}
                className="mt-6 w-full glass-button border border-amber-300/30 text-amber-200 hover:text-black hover:bg-amber-300 transition-all duration-300 py-3 text-[10px] tracking-widest uppercase font-mono flex items-center justify-center gap-2"
              >
                <Music2 className="w-3.5 h-3.5" />
                <span>Tap to start the music &amp; enter</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Music note under the card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-7 flex items-center justify-center gap-2 text-[9px] tracking-super-wide opacity-40 uppercase font-mono"
        >
          <Music className="w-3 h-3" />
          <span>Soundtrack Plays on Entry</span>
        </motion.div>
      </motion.div>
    </div>
  );
};
