import React, { useRef } from 'react';
import { Memory } from '../types';
import { Film, ChevronLeft, ChevronRight, Play, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';

interface TwoMonthsInMotionProps {
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
}

export const TwoMonthsInMotion: React.FC<TwoMonthsInMotionProps> = ({
  memories,
  onSelectMemory
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420;
      try {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } catch {
        scrollRef.current.scrollLeft += scrollAmount;
      }
    }
  };

  return (
    <section className="relative py-28 overflow-hidden bg-neutral-950/60 border-y border-white/5">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] tracking-super-wide opacity-40 uppercase font-mono mb-4">
            CONTINUOUS VISUAL REEL &bull; 62 DAYS
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light text-[#F5F5F5] tracking-tight">
            TWO MONTHS IN MOTION
          </h2>
          <p className="mt-4 text-xs sm:text-sm tracking-widest uppercase opacity-60 font-sans max-w-xl">
            Like unrolling a 35mm negative. Every frame an exact coordinate in time.
          </p>
        </div>

        {/* Scroll Nav Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 glass flex items-center justify-center border border-white/10 text-white hover:bg-white hover:text-black transition-all"
            aria-label="Scroll reel left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 glass flex items-center justify-center border border-white/10 text-white hover:bg-white hover:text-black transition-all"
            aria-label="Scroll reel right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Film Reel Sprocket Edge (Top) */}
      <div className="w-full overflow-hidden flex items-center justify-around py-2 border-y border-white/10 bg-black/80">
        {Array.from({ length: 32 }).map((_, i) => (
          <div key={i} className="w-4 h-2.5 bg-neutral-900 border border-white/10 flex-shrink-0 mx-2" />
        ))}
      </div>

      {/* Horizontal Film Reel Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto py-8 px-6 sm:px-12 no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing"
      >
        {memories.map((mem, index) => {
          const frameNumber = String(index + 1).padStart(2, '0');

          return (
            <div
              key={mem.id}
              onClick={() => onSelectMemory(mem)}
              className="flex-shrink-0 w-[280px] sm:w-[360px] md:w-[420px] group cursor-pointer"
            >
              <div className="glass p-3 border border-white/10 hover:border-white/25 transition-all duration-500 shadow-2xl relative overflow-hidden bg-black/90">
                {/* Frame Metadata Strip */}
                <div className="flex items-center justify-between font-mono text-[9px] opacity-50 uppercase tracking-widest mb-2.5 px-1">
                  <span>FRAME #{frameNumber}</span>
                  <span className="opacity-90 text-white">{mem.date}</span>
                  <span>{mem.chapter}</span>
                </div>

                {/* Media Image Frame */}
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-950 border border-white/10">
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {mem.isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 glass flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[9px] font-mono opacity-50 uppercase tracking-widest block">
                      {mem.location}
                    </span>
                    <h4 className="text-sm sm:text-base font-light text-white tracking-wider uppercase truncate mt-0.5">
                      {mem.title}
                    </h4>
                  </div>
                </div>

                {/* Short Caption */}
                <p className="mt-3 text-xs serif italic opacity-75 line-clamp-2 px-1">
                  “{mem.caption}”
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Film Reel Sprocket Edge (Bottom) */}
      <div className="w-full overflow-hidden flex items-center justify-around py-2 border-y border-white/10 bg-black/80">
        {Array.from({ length: 32 }).map((_, i) => (
          <div key={i} className="w-4 h-2.5 bg-neutral-900 border border-white/10 flex-shrink-0 mx-2" />
        ))}
      </div>
    </section>
  );
};
