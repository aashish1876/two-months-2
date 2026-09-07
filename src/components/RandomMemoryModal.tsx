import React, { useState, useEffect } from 'react';
import { Memory } from '../types';
import { Shuffle, X, Calendar, MapPin, Clock, Users, BookOpen, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RandomMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  memories: Memory[];
  onOpenFullMemory: (memory: Memory) => void;
}

export const RandomMemoryModal: React.FC<RandomMemoryModalProps> = ({
  isOpen,
  onClose,
  memories,
  onOpenFullMemory
}) => {
  const [currentMemory, setCurrentMemory] = useState<Memory | null>(null);
  const [turnKey, setTurnKey] = useState<number>(0);

  const drawRandom = () => {
    if (memories.length === 0) return;
    const randomIndex = Math.floor(Math.random() * memories.length);
    setCurrentMemory(memories[randomIndex]);
    setTurnKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (isOpen && memories.length > 0) {
      drawRandom();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Diary Card Container */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 sm:right-2 p-2 glass text-white hover:bg-white hover:text-black transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <AnimatePresence mode="wait">
          {currentMemory && (
            <motion.div
              key={turnKey}
              initial={{ rotateY: -70, opacity: 0, scale: 0.9 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: 70, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
              className="glass p-6 sm:p-8 border border-white/20 shadow-2xl bg-neutral-950/95 overflow-hidden flex flex-col"
            >
              {/* Diary Header Bookmark */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 opacity-60" />
                  <span className="text-[10px] font-mono tracking-widest opacity-60 uppercase">
                    TIME CAPSULE &bull; RANDOM DRAW
                  </span>
                </div>
                <div className="text-right font-mono text-[10px] opacity-40 uppercase tracking-widest">
                  <span>{currentMemory.date}</span>
                  <span className="mx-1.5">&bull;</span>
                  <span>{currentMemory.time}</span>
                </div>
              </div>

              {/* Memory Visual */}
              <div
                onClick={() => {
                  onClose();
                  onOpenFullMemory(currentMemory);
                }}
                className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-neutral-900 border border-white/10 shadow-inner group cursor-pointer mb-5"
              >
                <img
                  src={currentMemory.imageUrl}
                  alt={currentMemory.title}
                  className="w-full h-full object-cover filter grayscale contrast-105 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-neutral-300 uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {currentMemory.location}
                  </span>
                  <span className="opacity-60 text-[9px]">EXPAND</span>
                </div>
              </div>

              {/* Title & Caption */}
              <div>
                <h3 className="text-lg sm:text-xl font-light text-white tracking-wider uppercase">
                  {currentMemory.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base serif italic opacity-85">
                  “{currentMemory.caption}”
                </p>
                {currentMemory.story && (
                  <p className="mt-3 text-xs text-neutral-400 font-light leading-relaxed font-sans">
                    {currentMemory.story}
                  </p>
                )}
              </div>

              {/* Diary Footer Actions */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-[10px] font-mono opacity-50 tracking-widest uppercase">
                  <Users className="w-3 h-3" />
                  <span>WITH: {currentMemory.people.join(', ')}</span>
                </div>

                <button
                  onClick={drawRandom}
                  className="px-5 py-2.5 glass text-[10px] font-mono tracking-widest uppercase text-white hover:bg-white hover:text-black flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>DRAW ANOTHER</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
