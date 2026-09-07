import React, { useEffect } from 'react';
import { Memory } from '../types';
import { X, Calendar, MapPin, Clock, Users, ArrowLeft, ArrowRight, BookOpen, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MemoryLightboxProps {
  memory: Memory | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const MemoryLightbox: React.FC<MemoryLightboxProps> = ({
  memory,
  onClose,
  onNext,
  onPrev
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  if (!memory) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/95 backdrop-blur-3xl select-none">
        {/* Backdrop click to close */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Top Control Bar */}
        <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 glass text-[10px] font-mono tracking-widest uppercase opacity-75">
            <span>{memory.date}</span>
            <span>&bull;</span>
            <span className="text-white font-semibold">{memory.chapter}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 glass text-white hover:bg-white hover:text-black transition-all cursor-pointer"
            aria-label="Close lightbox"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Arrows */}
        {onPrev && (
          <button
            onClick={onPrev}
            className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 z-50 p-3 glass text-white hover:bg-white hover:text-black transition-all cursor-pointer"
            aria-label="Previous memory"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        {onNext && (
          <button
            onClick={onNext}
            className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 z-50 p-3 glass text-white hover:bg-white hover:text-black transition-all cursor-pointer"
            aria-label="Next memory"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 w-full max-w-6xl max-h-[92vh] glass overflow-hidden border border-white/15 shadow-2xl flex flex-col lg:flex-row bg-neutral-950/95"
        >
          {/* Image Pane */}
          <div className="lg:w-7/12 relative bg-black flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[400px]">
            <img
              src={memory.imageUrl}
              alt={memory.title}
              className="w-full h-full max-h-[75vh] object-contain"
            />
          </div>

          {/* Editorial Content Pane */}
          <div className="lg:w-5/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto border-t lg:border-t-0 lg:border-l border-white/10 max-h-[50vh] lg:max-h-[85vh]">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 text-[9px] font-mono opacity-50 uppercase tracking-widest mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {memory.time}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {memory.location}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-light text-white tracking-wider uppercase leading-tight">
                {memory.title}
              </h3>

              {/* Caption */}
              <p className="mt-3 text-sm sm:text-base serif italic opacity-85 border-l border-white/40 pl-3.5 leading-relaxed">
                “{memory.caption}”
              </p>

              {/* Extended Story if available */}
              {memory.story && (
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest opacity-50 uppercase mb-2">
                    <BookOpen className="w-3 h-3" />
                    <span>THE BACKSTORY</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed font-sans">
                    {memory.story}
                  </p>
                </div>
              )}
            </div>

            {/* People & Footer Details */}
            <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-mono opacity-60 tracking-widest uppercase">
                <Users className="w-3 h-3" />
                <span>WITH: {memory.people.join(' &bull; ')}</span>
              </div>

              <span className="text-[9px] font-mono opacity-30 tracking-widest uppercase">
                ARCHIVE ENTRY
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
