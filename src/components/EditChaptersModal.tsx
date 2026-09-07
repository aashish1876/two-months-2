import React, { useState, useEffect } from 'react';
import { ChapterId, ChapterInfo } from '../types';
import { X, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface EditChaptersModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Record<ChapterId, ChapterInfo>;
  onSaveChapters: (chapters: Record<ChapterId, ChapterInfo>) => void;
}

const CHAPTER_KEYS: ChapterId[] = [
  'THE BEGINNING',
  'THEN THIS HAPPENED...',
  'THE CHAOS',
  'THE LITTLE MOMENTS',
  'THE LAST DAYS'
];

export const EditChaptersModal: React.FC<EditChaptersModalProps> = ({
  isOpen,
  onClose,
  chapters,
  onSaveChapters
}) => {
  const [data, setData] = useState<Record<ChapterId, ChapterInfo>>(chapters);
  const [activeKey, setActiveKey] = useState<ChapterId>('THE BEGINNING');

  useEffect(() => {
    if (chapters) {
      setData(JSON.parse(JSON.stringify(chapters)));
    }
  }, [chapters, isOpen]);

  if (!isOpen) return null;

  const current = data[activeKey];

  const updateCurrent = (updates: Partial<ChapterInfo>) => {
    setData((prev) => ({
      ...prev,
      [activeKey]: {
        ...prev[activeKey],
        ...updates
      }
    }));
  };

  const handleSave = () => {
    onSaveChapters(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl">
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative z-10 w-full max-w-2xl glass p-6 sm:p-8 border border-white/15 shadow-2xl bg-neutral-950/95 max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-6">
          <div>
            <p className="text-[10px] tracking-super-wide opacity-40 uppercase font-mono mb-1">
              EDIT SECTION &bull; OUR STORY TIMELINE
            </p>
            <h3 className="text-xl sm:text-2xl font-light text-white tracking-wider uppercase">
              EDIT CHAPTER STORIES
            </h3>
            <p className="text-xs text-neutral-400 font-sans mt-1">
              Refine the chapter narrative summaries, subtitles, and dates.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 glass text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selection for 5 chapters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-white/10">
          {CHAPTER_KEYS.map((k) => (
            <button
              key={k}
              onClick={() => setActiveKey(k)}
              className={`px-3.5 py-2 text-[10px] font-mono uppercase tracking-widest flex-shrink-0 transition-all cursor-pointer ${
                activeKey === k
                  ? 'bg-white text-black font-semibold'
                  : 'glass text-neutral-400 hover:text-white'
              }`}
            >
              {data[k]?.title || k}
            </button>
          ))}
        </div>

        {current && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                  CHAPTER TITLE
                </label>
                <input
                  type="text"
                  value={current.title}
                  onChange={(e) => updateCurrent({ title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white text-sm uppercase tracking-wider"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                  DATE RANGE (E.G. JULY 01 — JULY 12)
                </label>
                <input
                  type="text"
                  value={current.dateRange}
                  onChange={(e) => updateCurrent({ dateRange: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                SUBTITLE / MOOD PHRASE
              </label>
              <input
                type="text"
                value={current.subtitle}
                onChange={(e) => updateCurrent({ subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white serif italic text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                CHAPTER NARRATIVE SUMMARY
              </label>
              <textarea
                rows={4}
                value={current.desc}
                onChange={(e) => updateCurrent({ desc: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white text-xs leading-relaxed resize-none"
              />
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 glass text-[10px] font-mono tracking-widest uppercase text-neutral-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-7 py-2.5 bg-white text-black hover:bg-neutral-200 font-semibold text-[10px] font-mono tracking-widest uppercase cursor-pointer"
              >
                Save Chapters
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
