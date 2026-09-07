import React, { useState, useRef, useEffect } from 'react';
import { Memory, ChapterId, Friend } from '../types';
import { compressImage } from '../utils/imageCompressor';
import { X, Upload, Camera, Trash2, Check, MapPin, Calendar, Clock, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface EditMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  memory: Memory | null;
  friends: Friend[];
  onSave: (memory: Memory) => void;
  onDelete?: (memoryId: string) => void;
}

const CHAPTER_OPTIONS: ChapterId[] = [
  'THE BEGINNING',
  'THEN THIS HAPPENED...',
  'THE CHAOS',
  'THE LITTLE MOMENTS',
  'THE LAST DAYS',
];

export const EditMemoryModal: React.FC<EditMemoryModalProps> = ({
  isOpen,
  onClose,
  memory,
  friends,
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState<Memory | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (memory) {
      setFormData(JSON.parse(JSON.stringify(memory)));
    }
  }, [memory, isOpen]);

  if (!isOpen || !formData) return null;

  const handleFileUpload = async (file: File) => {
    try {
      const compressed = await compressImage(file, 1400, 0.82);
      setFormData((prev) => (prev ? { ...prev, imageUrl: compressed } : null));
    } catch (err) {
      console.error('Error compressing memory image:', err);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleTogglePerson = (personName: string) => {
    const current = formData.people || [];
    if (current.includes(personName)) {
      setFormData({ ...formData, people: current.filter((p) => p !== personName) });
    } else {
      setFormData({ ...formData, people: [...current, personName] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Delete the memory "${formData.title}"? This cannot be undone.`)) {
      if (onDelete) onDelete(formData.id);
      onClose();
    }
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
              EDIT MEMORY SNAPSHOT &bull; {formData.chapter}
            </p>
            <h3 className="text-xl sm:text-2xl font-light text-white tracking-wider uppercase">
              EDIT MEMORY
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 glass text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photograph Upload / URL */}
          <div className="p-4 glass border border-white/10 space-y-3">
            <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 flex items-center gap-2">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>PHOTO</span>
            </label>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-28 h-28 bg-neutral-900 border border-white/20 overflow-hidden flex-shrink-0">
                <img
                  src={formData.imageUrl}
                  alt={formData.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 w-full space-y-2">
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-3 border-2 border-dashed text-center cursor-pointer transition-all ${
                    isDragging ? 'border-amber-400 bg-amber-400/10' : 'border-white/15 hover:border-white/30 bg-black/40'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <Upload className="w-4 h-4 mx-auto mb-1 text-neutral-400" />
                  <p className="text-xs text-neutral-200">
                    <span className="font-semibold underline">Upload new photo</span> or drag & drop
                  </p>
                </div>

                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="Or paste direct image URL"
                  className="w-full px-3 py-1.5 bg-black/50 border border-white/15 text-white text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
              TITLE *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white font-sans text-sm tracking-wide uppercase"
            />
          </div>

          {/* Caption */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
              SHORT CAPTION
            </label>
            <input
              type="text"
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white serif italic text-sm"
            />
          </div>

          {/* Detailed Story */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
              DETAILED STORY / DIARY NOTE
            </label>
            <textarea
              rows={3}
              value={formData.story || ''}
              onChange={(e) => setFormData({ ...formData, story: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white text-xs leading-relaxed resize-none"
            />
          </div>

          {/* Date, Time, Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[9px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
                DATE
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/15 text-white font-mono text-xs uppercase"
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
                TIME
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/15 text-white font-mono text-xs uppercase"
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
                LOCATION
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/15 text-white font-mono text-xs"
              />
            </div>
          </div>

          {/* Chapter Selector */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
              CHAPTER
            </label>
            <select
              value={formData.chapter}
              onChange={(e) => setFormData({ ...formData, chapter: e.target.value as ChapterId })}
              className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/15 text-white font-mono text-xs uppercase"
            >
              {CHAPTER_OPTIONS.map((ch) => (
                <option key={ch} value={ch} className="bg-neutral-900 text-white">
                  {ch}
                </option>
              ))}
            </select>
          </div>

          {/* People involved */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
              PEOPLE IN THIS MEMORY
            </label>
            <div className="flex flex-wrap gap-2">
              {friends.map((f) => {
                const isSelected = (formData.people || []).includes(f.name);
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleTogglePerson(f.name)}
                    className={`px-3 py-1.5 text-xs font-mono border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-black border-white'
                        : 'glass text-neutral-400 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {f.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Highlight Toggles */}
          <div className="flex items-center gap-6 p-3 glass border border-white/10 text-xs font-mono">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isHero || false}
                onChange={(e) => setFormData({ ...formData, isHero: e.target.checked })}
                className="accent-white"
              />
              <span>HERO HIGHLIGHT (FEATURED)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isRandomFavorite || false}
                onChange={(e) => setFormData({ ...formData, isRandomFavorite: e.target.checked })}
                className="accent-white"
              />
              <span>RANDOM FAVORITE</span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            {onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="text-[10px] font-mono uppercase text-red-400 hover:text-red-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>DELETE MEMORY</span>
              </button>
            )}

            <div className="flex gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 glass text-[10px] font-mono tracking-widest uppercase text-neutral-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-7 py-2.5 bg-white text-black hover:bg-neutral-200 font-semibold text-[10px] font-mono tracking-widest uppercase cursor-pointer"
              >
                Save Memory
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
