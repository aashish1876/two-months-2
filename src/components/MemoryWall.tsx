import React, { useState } from 'react';
import { Memory } from '../types';
import { MapPin, Clock, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';

interface MemoryWallProps {
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
}

export const MemoryWall: React.FC<MemoryWallProps> = ({
  memories,
  onSelectMemory,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = memories.filter((m) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'CANDIDS') return m.type === 'candid' || m.type === 'polaroid';
    if (filterType === 'HERO') return m.isHero;
    if (filterType === 'FAVORITES') return m.isRandomFavorite;
    return true;
  });

  return (
    <section id="photos" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/10 pb-8">
        <div>
          <p className="text-[10px] tracking-super-wide opacity-40 uppercase font-mono mb-3">
            PHOTO ARCHIVE &bull; 62 DAYS
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light text-[#F5F5F5] tracking-tight">
            THE MEMORY WALL
          </h2>
          <p className="mt-3 text-xs sm:text-sm tracking-widest uppercase opacity-60 font-sans max-w-xl">
            No stiff poses. No filters trying to pretend we were anywhere else. Just us, exactly as we were.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {['ALL', 'HERO', 'CANDIDS', 'FAVORITES'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 text-[10px] tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                filterType === type
                  ? 'bg-white text-black font-semibold'
                  : 'glass text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Editorial Asymmetric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
        {filtered.map((memory, index) => {
          // Dynamic layout weighting
          const isWide = index % 5 === 0 || memory.isHero;
          const isTall = index % 3 === 1 && !isWide;
          const colSpan = isWide ? 'md:col-span-8 lg:col-span-8' : isTall ? 'md:col-span-4 lg:col-span-4' : 'md:col-span-4 lg:col-span-4';
          const heightClass = isWide ? 'h-[380px] sm:h-[480px]' : isTall ? 'h-[460px] sm:h-[560px]' : 'h-[320px] sm:h-[380px]';

          return (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: (index % 4) * 0.1 }}
              className={`${colSpan} group cursor-pointer relative`}
              onClick={() => onSelectMemory(memory)}
            >
              {/* Card Container with subtle editorial glass frame */}
              <div
                className="relative glass p-2 border border-white/10 hover:border-white/25 transition-all duration-500 shadow-2xl group-hover:-translate-y-1"
              >
                <div className={`relative w-full ${heightClass} overflow-hidden bg-neutral-950`}>
                  <img
                    src={memory.imageUrl}
                    alt={memory.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-700 ease-out"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/15 text-[9px] font-mono tracking-widest opacity-80 text-white uppercase">
                      {memory.date}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="w-7 h-7 bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* Bottom Editorial Caption */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="flex items-center gap-2 text-[9px] font-mono opacity-50 tracking-widest uppercase mb-1.5">
                      <Clock className="w-3 h-3" />
                      <span>{memory.time}</span>
                      <span>&bull;</span>
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{memory.location}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-light text-white tracking-wider uppercase leading-snug">
                      {memory.title}
                    </h3>

                    <p className="mt-1 text-xs sm:text-sm serif italic opacity-80 line-clamp-2">
                      &ldquo;{memory.caption}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
