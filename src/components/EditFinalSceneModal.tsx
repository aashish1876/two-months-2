import React, { useState, useRef, useEffect } from 'react';
import { FinalSceneConfig } from '../types';
import { compressImage } from '../utils/imageCompressor';
import { X, Upload, Camera, Sparkles, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface EditFinalSceneModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FinalSceneConfig;
  onSave: (config: FinalSceneConfig) => void;
}

export const EditFinalSceneModal: React.FC<EditFinalSceneModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave
}) => {
  const [formData, setFormData] = useState<FinalSceneConfig>(config);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (config) {
      setFormData(JSON.parse(JSON.stringify(config)));
    }
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    try {
      const compressed = await compressImage(file, 1600, 0.82);
      setFormData((prev) => ({ ...prev, bgImageUrl: compressed }));
    } catch (err) {
      console.error('Error compressing final scene image:', err);
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
              EDIT SECTION &bull; EPILOGUE &amp; FAREWELL
            </p>
            <h3 className="text-xl sm:text-2xl font-light text-white tracking-wider uppercase">
              EDIT FINAL SCENE
            </h3>
            <p className="text-xs text-neutral-400 font-sans mt-1">
              Reflect on the two months with custom words, coordinate markers, and closing picture.
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
            <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 flex items-center gap-2">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>CLOSING BACKGROUND PHOTO</span>
            </label>

            <div className="relative w-full h-32 bg-neutral-900 border border-white/15 overflow-hidden">
              <img
                src={formData.bgImageUrl}
                alt="Final scene preview"
                className="w-full h-full object-cover filter brightness-[0.6]"
              />
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => fileInputRef.current?.click()}
              className="p-3 border-2 border-dashed border-white/15 hover:border-white/30 text-center cursor-pointer bg-black/40"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
              />
              <Upload className="w-4 h-4 mx-auto mb-1 text-neutral-400" />
              <p className="text-xs text-neutral-200">
                <span className="font-semibold underline">Upload a photo</span> or drag & drop
              </p>
            </div>

            <input
              type="url"
              value={formData.bgImageUrl}
              onChange={(e) => setFormData({ ...formData, bgImageUrl: e.target.value })}
              placeholder="Or paste direct image URL"
              className="w-full px-3 py-1.5 bg-black/50 border border-white/15 text-white text-xs font-mono"
            />
          </div>

          {/* Eyebrow marker */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
              COORDINATE / EYEBROW BADGE
            </label>
            <input
              type="text"
              value={formData.eyebrow}
              onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white font-mono text-xs uppercase"
            />
          </div>

          {/* Headline */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
              OPENING STATEMENT
            </label>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white text-base tracking-wider uppercase"
            />
          </div>

          {/* Big Quote */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
              THE BIG REFLECTION QUOTE (ITALIC)
            </label>
            <textarea
              rows={3}
              value={formData.bigQuote}
              onChange={(e) => setFormData({ ...formData, bigQuote: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white serif italic text-base leading-relaxed"
            />
          </div>

          {/* Closing Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                NOTE LINE 1 (UPPERCASE)
              </label>
              <input
                type="text"
                value={formData.noteLine1}
                onChange={(e) => setFormData({ ...formData, noteLine1: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white text-xs uppercase tracking-wider"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                NOTE LINE 2 (ITALIC SERIF)
              </label>
              <input
                type="text"
                value={formData.noteLine2}
                onChange={(e) => setFormData({ ...formData, noteLine2: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white serif italic text-xs"
              />
            </div>
          </div>

          {/* Closing Signoff */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
              FINAL SIGNOFF
            </label>
            <input
              type="text"
              value={formData.closingSignoff}
              onChange={(e) => setFormData({ ...formData, closingSignoff: e.target.value })}
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
              Save Final Scene
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
