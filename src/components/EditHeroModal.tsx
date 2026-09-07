import React, { useState, useRef, useEffect } from 'react';
import { HeroConfig } from '../types';
import { compressImage } from '../utils/imageCompressor';
import { X, Upload, Check, Camera, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface EditHeroModalProps {
  isOpen: boolean;
  onClose: () => void;
  heroConfig: HeroConfig;
  onSave: (config: HeroConfig) => void;
}

const SAMPLE_HERO_BG = [
  { label: 'Golden Hour Laughing', url: './assets/aistudio/mem-1-pact.jpg' },
  { label: 'Coastal Road Trip Highway', url: './assets/aistudio/mem-2-coastal-bend.jpg' },
  { label: 'Sunset Bonfire Beach', url: './assets/aistudio/mem-3-pier-jump.jpg' },
  { label: 'City Skyline Night Lights', url: './assets/aistudio/mem-8-desert-stars.jpg' },
  { label: 'Mountain Overlook Fog', url: './assets/aistudio/mem-13-bonfire.jpg' }
];

export const EditHeroModal: React.FC<EditHeroModalProps> = ({
  isOpen,
  onClose,
  heroConfig,
  onSave
}) => {
  const [formData, setFormData] = useState<HeroConfig>(heroConfig);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (heroConfig) {
      setFormData(JSON.parse(JSON.stringify(heroConfig)));
    }
  }, [heroConfig, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    try {
      const compressed = await compressImage(file, 1600, 0.82);
      setFormData((prev) => ({ ...prev, bgImageUrl: compressed }));
    } catch (err) {
      console.error('Error compressing hero image:', err);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
              EDIT SECTION &bull; COVER &amp; HERO
            </p>
            <h3 className="text-xl sm:text-2xl font-light text-white tracking-wider uppercase">
              EDIT HERO SECTION
            </h3>
            <p className="text-xs text-neutral-400 font-sans mt-1">
              Customize the opening title, intro storytelling, and the cinematic background photo.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 glass text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Background Photo */}
          <div className="p-4 glass border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>HERO BACKGROUND PHOTOGRAPH</span>
              </label>
            </div>

            <div className="relative w-full h-36 bg-neutral-900 border border-white/15 overflow-hidden">
              <img
                src={formData.bgImageUrl}
                alt="Hero preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] font-mono text-white/90">
                LIVE PREVIEW
              </div>
            </div>

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
                <span className="font-semibold underline">Upload a photo</span> or drag & drop
              </p>
            </div>

            <div>
              <label className="block text-[9px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
                Or paste image URL:
              </label>
              <input
                type="url"
                value={formData.bgImageUrl}
                onChange={(e) => setFormData({ ...formData, bgImageUrl: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/15 text-white text-xs font-mono"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {SAMPLE_HERO_BG.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFormData({ ...formData, bgImageUrl: preset.url })}
                  className="text-[9px] font-mono px-2 py-1 glass border border-white/10 hover:border-white/30 text-neutral-300 cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                EYEBROW BADGE
              </label>
              <input
                type="text"
                value={formData.eyebrow}
                onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white font-mono text-xs uppercase"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                STATS / SUMMARY BADGE
              </label>
              <input
                type="text"
                value={formData.statBadge}
                onChange={(e) => setFormData({ ...formData, statBadge: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white font-mono text-xs uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                MAIN TITLE
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white text-base tracking-wider uppercase"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                ITALIC SUBTITLE
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white serif italic text-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
              INTRO STORYTELLING DESCRIPTION
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white text-xs font-sans leading-relaxed resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
              BUTTON CALL TO ACTION
            </label>
            <input
              type="text"
              value={formData.buttonText}
              onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white font-mono text-xs uppercase tracking-widest"
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
              type="submit"
              className="px-7 py-2.5 bg-white text-black hover:bg-neutral-200 font-semibold text-[10px] font-mono tracking-widest uppercase cursor-pointer"
            >
              Save Hero Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
