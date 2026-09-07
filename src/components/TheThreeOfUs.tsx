import React, { useState } from 'react';
import { Friend, GroupConfig } from '../types';
import { DEFAULT_GROUP_CONFIG } from '../data/memoriesData';
import { Camera } from 'lucide-react';
import { motion } from 'motion/react';

interface TheThreeOfUsProps {
  friends: Friend[];
  groupConfig?: GroupConfig;
}

export const TheThreeOfUs: React.FC<TheThreeOfUsProps> = ({
  friends,
  groupConfig = DEFAULT_GROUP_CONFIG,
}) => {
  const [activeFriendId, setActiveFriendId] = useState<string>(friends[0]?.id || 'julian');

  const displayHeadline = groupConfig.headline || DEFAULT_GROUP_CONFIG.headline;
  const displaySubheadline = groupConfig.subheadline || DEFAULT_GROUP_CONFIG.subheadline;
  const displayDescription = groupConfig.description || DEFAULT_GROUP_CONFIG.description;
  const displayPhoto = groupConfig.groupPhotoUrl || DEFAULT_GROUP_CONFIG.groupPhotoUrl;
  const displayCaption = groupConfig.groupPhotoCaption || groupConfig.quote || DEFAULT_GROUP_CONFIG.groupPhotoCaption || DEFAULT_GROUP_CONFIG.quote;
  const displayStat = groupConfig.statText || groupConfig.mileMarker || DEFAULT_GROUP_CONFIG.statText || DEFAULT_GROUP_CONFIG.mileMarker;

  return (
    <section id="the-three-of-us" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <p className="text-[10px] tracking-super-wide opacity-40 uppercase font-mono mb-4">
          THE THREE OF US
        </p>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light text-[#F5F5F5] tracking-tight leading-tight">
          {displayHeadline}
          <br />
          <span className="serif italic font-normal text-2xl sm:text-4xl lg:text-5xl opacity-80 block mt-2">
            {displaySubheadline}
          </span>
        </h2>
        <p className="mt-4 text-xs sm:text-sm tracking-widest uppercase opacity-60 leading-relaxed font-sans max-w-xl mx-auto">
          {displayDescription}
        </p>
      </div>

      {/* 1. Large Beautiful Group Photograph First */}
      <div className="relative mb-20 glass p-2 sm:p-3 border border-white/10 shadow-2xl group">
        <div className="relative w-full h-[360px] sm:h-[480px] md:h-[540px] overflow-hidden bg-neutral-900">
          <img
            src={displayPhoto}
            alt="The Three Best Friends Together"
            className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

          {/* Group Photo Caption & Metadata */}
          <div className="absolute bottom-6 left-6 right-6 sm:left-10 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[9px] tracking-super-wide font-mono opacity-60 uppercase px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10">
                {displayStat}
              </span>
              <h3 className="text-lg sm:text-2xl serif italic text-[#F5F5F5] mt-2 opacity-90">
                &ldquo;{displayCaption}&rdquo;
              </h3>
              <p className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase mt-1">
                {friends.map((f) => f.name.toUpperCase()).join(' • ')}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="glass text-[10px] tracking-widest uppercase text-white px-5 py-2.5 rounded-none flex items-center gap-2">
                <Camera className="w-3 h-3" />
                <span>FULLSCREEN</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Individual Friends Revealed Together */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {friends.map((friend, index) => {
          const isSelected = activeFriendId === friend.id;

          return (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              onClick={() => setActiveFriendId(friend.id)}
              className={`p-6 sm:p-7 transition-all duration-500 cursor-pointer relative overflow-hidden flex flex-col justify-between border ${
                isSelected
                  ? 'bg-[#0a0a0a] border-white/25 shadow-2xl'
                  : 'bg-[#0a0a0a]/50 border-white/5 hover:border-white/15'
              }`}
            >
              {/* Top Row: Portrait + Identity */}
              <div>
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-28 sm:w-24 sm:h-32 bg-zinc-900 border border-white/10 overflow-hidden flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-700 shadow-md">
                    <img
                      src={friend.portrait}
                      alt={friend.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] tracking-super-wide font-mono opacity-40 uppercase">
                        0{index + 1} / 03
                      </span>
                    </div>

                    <h4 className="text-xl sm:text-2xl font-light text-white tracking-wider uppercase mt-1 truncate">
                      {friend.name}
                    </h4>
                    <p className="text-[10px] opacity-60 font-mono tracking-widest uppercase mt-0.5 truncate">
                      {friend.role}
                    </p>

                    {/* Vibe Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {friend.vibeTags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[8px] font-mono tracking-widest uppercase px-2 py-0.5 bg-white/5 border border-white/10 text-neutral-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Personality narrative */}
                <p className="mt-5 text-xs sm:text-sm text-neutral-400 leading-relaxed font-light font-sans">
                  {friend.personality}
                </p>

                {/* Editorial Quote Card */}
                <div className="glass mt-5 p-5 relative overflow-hidden border border-white/10">
                  <div className="absolute top-0 right-0 p-3 opacity-10 serif italic text-3xl">
                    &ldquo;
                  </div>
                  <p className="serif text-sm sm:text-base italic leading-relaxed opacity-80 pr-4">
                    &ldquo;{friend.quote}&rdquo;
                  </p>
                  <div className="mt-3 text-[8px] tracking-widest opacity-40 uppercase font-mono">
                    Direct Quote &bull; {friend.name}
                  </div>
                </div>
              </div>

              {/* Connected Photos Strip for this friend */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-[9px] tracking-widest font-mono opacity-40 uppercase">
                    MOMENTS WITH {friend.name.toUpperCase()}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {friend.connectedPhotos.map((photoUrl, pIdx) => (
                    <div
                      key={pIdx}
                      className="aspect-square bg-zinc-900 border border-white/10 grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer overflow-hidden relative"
                    >
                      <img
                        src={photoUrl}
                        alt={`${friend.name} memory snapshot`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
