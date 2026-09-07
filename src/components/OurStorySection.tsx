import React, { useState } from 'react';
import { ChapterId, ChapterInfo, Memory } from '../types';
import { CHAPTERS_INFO as DEFAULT_CHAPTERS_INFO } from '../data/memoriesData';
import { Calendar, MapPin, Users, ChevronRight, Film } from 'lucide-react';
import { motion } from 'motion/react';

interface OurStorySectionProps {
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
  chaptersInfo?: Record<ChapterId, ChapterInfo>;
}

const CHAPTERS_LIST: ChapterId[] = [
  'THE BEGINNING',
  'THEN THIS HAPPENED...',
  'THE CHAOS',
  'THE LITTLE MOMENTS',
  'THE LAST DAYS',
];

export const OurStorySection: React.FC<OurStorySectionProps> = ({
  memories,
  onSelectMemory,
  chaptersInfo = DEFAULT_CHAPTERS_INFO,
}) => {
  const [selectedChapter, setSelectedChapter] = useState<ChapterId | 'ALL'>('ALL');

  const filteredMemories = selectedChapter === 'ALL'
    ? memories
    : memories.filter((m) => m.chapter === selectedChapter);

  const currentInfo = chaptersInfo;

  return (
    <section id="our-story" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <p className="text-[10px] tracking-super-wide opacity-40 uppercase font-mono mb-4">
          CHRONOLOGICAL ARCHIVE &bull; 62 DAYS
        </p>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light text-[#F5F5F5] tracking-tight leading-tight">
          OUR TWO-MONTH STORY
        </h2>
        <p className="mt-4 text-xs sm:text-sm tracking-widest uppercase opacity-60 font-sans max-w-md mx-auto">
          Divided not by weeks on a calendar, but by the moments that permanently reshaped us.
        </p>
      </div>

      {/* Chapter Selection Bar */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-16">
        <button
          onClick={() => setSelectedChapter('ALL')}
          className={`px-5 py-2 text-[10px] tracking-widest uppercase transition-all duration-300 ${
            selectedChapter === 'ALL'
              ? 'bg-white text-black font-semibold'
              : 'glass text-neutral-300 hover:bg-white/10'
          }`}
        >
          ALL MOMENTS
        </button>

        {CHAPTERS_LIST.map((chap) => {
          const info = currentInfo[chap] || DEFAULT_CHAPTERS_INFO[chap];
          const isSelected = selectedChapter === chap;

          return (
            <button
              key={chap}
              onClick={() => setSelectedChapter(chap)}
              className={`px-4 py-2 text-[10px] tracking-widest uppercase transition-all duration-300 ${
                isSelected
                  ? 'bg-white text-black font-semibold'
                  : 'glass text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {info.title}
            </button>
          );
        })}
      </div>

      {/* Active Chapter Overview Callout if specific chapter is selected */}
      {selectedChapter !== 'ALL' && (
        <div className="glass p-6 sm:p-8 mb-14 border border-white/10 max-w-4xl mx-auto animate-in fade-in duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
            <div>
              <span className="text-[9px] tracking-super-wide font-mono opacity-40 uppercase">
                {currentInfo[selectedChapter]?.dateRange}
              </span>
              <h3 className="text-xl sm:text-2xl font-light text-white tracking-wider uppercase mt-1">
                {currentInfo[selectedChapter]?.title}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm serif italic opacity-75 max-w-sm">
                "{currentInfo[selectedChapter]?.subtitle}"
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
            {currentInfo[selectedChapter]?.desc}
          </p>
        </div>
      )}

      {/* Fluid Chronological Stream */}
      <div className="relative border-l border-white/10 ml-4 sm:ml-8 md:ml-32 pl-6 sm:pl-10 space-y-20">
        {filteredMemories.map((mem, index) => {
          return (
            <motion.article
              key={mem.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: index * 0.05 }}
              className="relative group"
            >
              {/* Timeline Pin Indicator */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-6 w-3 h-3 bg-neutral-900 border border-white/60 group-hover:scale-125 group-hover:bg-white transition-all duration-300" />

              {/* Timestamp Sticky Label on Left (for tablet/desktop) */}
              <div className="hidden md:block absolute -left-36 top-5 text-right w-24">
                <span className="block font-mono text-[11px] font-semibold text-neutral-300 tracking-wider">
                  {mem.date}
                </span>
                <span className="block font-mono text-[9px] tracking-widest opacity-40 uppercase">
                  {mem.time}
                </span>
              </div>

              {/* Memory Card */}
              <div
                onClick={() => onSelectMemory(mem)}
                className="glass p-4 sm:p-7 border border-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer group-hover:shadow-2xl overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
                  {/* Visual Media Column */}
                  <div className="lg:col-span-6 relative border border-white/10 overflow-hidden aspect-[4/3] bg-neutral-950">
                    <img
                      src={mem.imageUrl}
                      alt={mem.title}
                      loading="lazy"
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Video Tag badge */}
                    {mem.isVideo && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/15 flex items-center gap-1.5 text-[9px] font-mono text-neutral-200 tracking-widest uppercase">
                        <Film className="w-3 h-3" />
                        <span>VIDEO MEMORY</span>
                      </div>
                    )}

                    {/* Chapter Tag badge */}
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/15 text-[9px] font-mono text-neutral-300 tracking-widest uppercase">
                      {mem.chapter}
                    </div>
                  </div>

                  {/* Narrative Text Column */}
                  <div className="lg:col-span-6 flex flex-col justify-between h-full">
                    <div>
                      {/* Mobile Timestamp & Location */}
                      <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono opacity-50 uppercase tracking-widest mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-neutral-400" />
                          {mem.date} &bull; {mem.time}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1 text-neutral-400">
                          <MapPin className="w-3 h-3 text-neutral-400" />
                          {mem.location}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-light text-white tracking-wider uppercase group-hover:opacity-80 transition-opacity">
                        {mem.title}
                      </h3>

                      <p className="mt-3 text-sm sm:text-base serif italic opacity-85 leading-snug">
                        "{mem.caption}"
                      </p>

                      {mem.story && (
                        <p className="mt-3 text-xs sm:text-sm text-neutral-400 font-light leading-relaxed font-sans">
                          {mem.story}
                        </p>
                      )}
                    </div>

                    {/* Footer Info */}
                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="text-[10px] font-mono text-neutral-400 tracking-widest uppercase">
                          WITH: {mem.people.join(' &bull; ').toUpperCase()}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono tracking-widest uppercase opacity-70 flex items-center gap-1 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                        <span>OPEN</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};
