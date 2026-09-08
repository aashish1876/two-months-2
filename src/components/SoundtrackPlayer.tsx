import React, { useState, useEffect } from 'react';
import { Play, Pause, Disc3, Volume2, VolumeX, Music2, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import { memoryAudio } from '../utils/audioEngine';

interface SoundtrackPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const SoundtrackPlayer: React.FC<SoundtrackPlayerProps> = ({
  isPlaying,
  onTogglePlay
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Interval removed: no longer updating unused progress state
  }, [isPlaying]);

  return (
    <aside
      aria-label="Soundtrack Player"
      className="fixed bottom-6 right-6 z-40 w-auto hidden sm:block select-none"
    >
      <div className="glass px-6 py-3 rounded-full flex items-center gap-4 border border-white/10 shadow-2xl text-[#F5F5F5]">
        {/* Pulsing indicator */}
        <div
          className={`w-2 h-2 rounded-full ${
            isPlaying ? 'bg-white animate-pulse' : 'bg-white/30'
          }`}
        />

        {/* Status label */}
        <div className="text-[9px] tracking-widest opacity-50 uppercase font-sans">
          {isPlaying ? 'Now Playing' : 'Soundtrack'}
        </div>

        {/* Track Title */}
        <div className="text-[10px] font-bold tracking-wider font-sans whitespace-nowrap">
          Summer Glass &mdash; Memory Lane
        </div>

        {/* Play / Pause Toggle */}
        <button
          onClick={onTogglePlay}
          className="hover:opacity-50 transition-opacity ml-2 focus:outline-none cursor-pointer"
          title={isPlaying ? 'Pause soundtrack' : 'Play soundtrack'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          )}
        </button>
      </div>
    </aside>
  );
};
