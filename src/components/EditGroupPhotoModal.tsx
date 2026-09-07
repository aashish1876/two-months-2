import React, { useState, useRef, useEffect } from 'react';
import { GroupConfig, Friend } from '../types';
import { DEFAULT_GROUP_CONFIG } from '../data/memoriesData';
import { compressImage } from '../utils/imageCompressor';
import { X, Upload, Check, Camera, Sparkles, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EditGroupPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupConfig: GroupConfig;
  friends: Friend[];
  onSave: (config: GroupConfig) => void;
}

const PRESET_GROUP_PHOTOS = [
  {
    label: 'Golden Hour Laughing Trio',
    url: '/assets/aistudio/maya-portrait-alt.jpg'
  },
  {
    label: 'Overlook Horizon Silhouette',
    url: '/assets/aistudio/mem-1-pact.jpg'
  },
  {
    label: 'Beach Sunset Laughter',
    url: '/assets/aistudio/mem-3-pier-jump.jpg'
  },
  {
    label: 'Highway Road Trip Vintage',
    url: '/assets/aistudio/mem-2-coastal-bend.jpg'
  },
  {
    label: 'Night City Lights Laugh',
    url: '/assets/aistudio/maya-connected-2.jpg'
  },
  {
    label: 'Campfire Night Under Stars',
    url: '/assets/aistudio/group-preset-mountain.jpg'
  }
];

export const EditGroupPhotoModal: React.FC<EditGroupPhotoModalProps> = ({
  isOpen,
  onClose,
  groupConfig,
  friends,
  onSave
}) => {
  const [formData, setFormData] = useState<GroupConfig>(groupConfig);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showSavedFeedback, setShowSavedFeedback] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (groupConfig) {
      setFormData({
        ...DEFAULT_GROUP_CONFIG,
        ...groupConfig,
        groupPhotoUrl: groupConfig.groupPhotoUrl || DEFAULT_GROUP_CONFIG.groupPhotoUrl,
        groupPhotoCaption: groupConfig.groupPhotoCaption || groupConfig.quote || DEFAULT_GROUP_CONFIG.groupPhotoCaption,
        statText: groupConfig.statText || groupConfig.mileMarker || DEFAULT_GROUP_CONFIG.statText,
        headline: groupConfig.headline || DEFAULT_GROUP_CONFIG.headline,
        subheadline: groupConfig.subheadline || DEFAULT_GROUP_CONFIG.subheadline,
        description: groupConfig.description || DEFAULT_GROUP_CONFIG.description
      });
    }
  }, [groupConfig, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setIsUploading(true);
    try {
      const compressed = await compressImage(file, 1600, 0.82);
      setFormData((prev) => ({
        ...prev,
        groupPhotoUrl: compressed
      }));
    } catch (err) {
      console.error('Failed to compress group photo:', err);
    } finally {
      setIsUploading(false);
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
    const finalData: GroupConfig = {
      ...formData,
      quote: formData.groupPhotoCaption || formData.quote || DEFAULT_GROUP_CONFIG.quote,
      caption: formData.groupPhotoCaption || formData.caption || DEFAULT_GROUP_CONFIG.caption,
      groupPhotoCaption: formData.groupPhotoCaption || DEFAULT_GROUP_CONFIG.groupPhotoCaption,
      statText: formData.statText || DEFAULT_GROUP_CONFIG.statText,
      mileMarker: formData.statText || DEFAULT_GROUP_CONFIG.mileMarker
    };
    onSave(finalData);
    setShowSavedFeedback(true);
    setTimeout(() => {
      setShowSavedFeedback(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    if (window.confirm('Reset group photograph and text to default?')) {
      setFormData(DEFAULT_GROUP_CONFIG);
      onSave(DEFAULT_GROUP_CONFIG);
      setShowSavedFeedback(true);
      setTimeout(() => {
        setShowSavedFeedback(false);
        onClose();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl">
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative z-10 w-full max-w-2xl glass p-5 sm:p-8 border border-white/15 shadow-2xl bg-neutral-950/95 max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-6">
          <div>
            <p className="text-[10px] tracking-super-wide opacity-40 uppercase font-mono mb-1">
              THE THREE OF US &bull; MAIN GROUP PHOTOGRAPH
            </p>
            <h3 className="text-xl sm:text-2xl font-light text-white tracking-wider uppercase">
              EDIT GROUP PHOTO
            </h3>
            <p className="text-xs text-neutral-400 font-sans mt-1">
              Replace the large trio photo, update the caption quote, or customize the date badge.
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
          {/* Live Photograph Preview */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-2 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>CURRENT GROUP PHOTO PREVIEW</span>
            </label>
            <div className="relative w-full h-56 sm:h-64 bg-neutral-900 border border-white/20 overflow-hidden shadow-inner group">
              <img
                src={formData.groupPhotoUrl}
                alt="Group Photo Preview"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 text-left">
                <span className="text-[8px] font-mono px-2 py-0.5 bg-black/70 border border-white/10 uppercase tracking-widest text-neutral-300">
                  {formData.statText || 'COLLECTIVE MEMORY'}
                </span>
                <p className="text-xs serif italic text-white mt-1 line-clamp-1">
                  &ldquo;{formData.groupPhotoCaption || 'We never took ourselves seriously...'}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Upload Box */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            className={`p-5 border border-dashed text-center flex flex-col items-center justify-center transition-colors ${
              isDragging
                ? 'border-amber-400 bg-amber-500/10'
                : 'border-white/20 bg-white/5 hover:bg-white/10'
            }`}
          >
            <Upload className="w-6 h-6 text-neutral-400 mb-2" />
            <p className="text-xs text-neutral-300 font-sans">
              {isUploading ? 'Compressing and optimizing photo...' : 'Drag & drop your trio photo here, or'}
            </p>
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-[10px] font-mono uppercase tracking-widest px-4 py-2 glass text-white hover:bg-white hover:text-black transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {isUploading ? 'OPTIMIZING...' : 'SELECT FROM DEVICE / CAMERA'}
            </button>
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
            <p className="text-[9px] text-neutral-500 font-mono mt-2">
              Auto-compressed to load instantly and persist in capsule
            </p>
          </div>

          {/* Image URL fallback */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
              OR PASTE IMAGE URL
            </label>
            <input
              type="text"
              value={formData.groupPhotoUrl}
              onChange={(e) => setFormData({ ...formData, groupPhotoUrl: e.target.value })}
              placeholder="/assets/aistudio/..."
              className="w-full px-3.5 py-2 bg-black/50 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-white/50"
            />
          </div>

          {/* Preset Buttons */}
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 block mb-2">
              OR CHOOSE A CINEMATIC PRESET:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_GROUP_PHOTOS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setFormData({ ...formData, groupPhotoUrl: preset.url })}
                  className={`text-[9px] font-mono px-2.5 py-1.5 border transition-all cursor-pointer ${
                    formData.groupPhotoUrl === preset.url
                      ? 'bg-amber-400 text-black border-amber-300 font-bold'
                      : 'glass text-neutral-400 hover:text-white border-white/10'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Quote / Caption & Milestone Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                GROUP PHOTO QUOTE / CAPTION
              </label>
              <textarea
                rows={2}
                value={formData.groupPhotoCaption}
                onChange={(e) => setFormData({ ...formData, groupPhotoCaption: e.target.value })}
                placeholder="“We never took ourselves seriously, but we took every moment together by heart.”"
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white serif italic text-sm focus:outline-none focus:border-white/50 leading-relaxed resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                BADGE / DATE TAG
              </label>
              <input
                type="text"
                value={formData.statText}
                onChange={(e) => setFormData({ ...formData, statText: e.target.value })}
                placeholder="COLLECTIVE MEMORY • JULY 22"
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white font-mono text-xs uppercase focus:outline-none focus:border-white/50 tracking-wider"
              />
              <p className="text-[9px] text-neutral-500 font-mono mt-1.5">
                Appears above the photo caption
              </p>
            </div>
          </div>

          {/* Headline & Subheadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                SECTION HEADLINE
              </label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                placeholder="Three completely different people."
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white text-sm font-light focus:outline-none focus:border-white/50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                ITALIC SUB-HEADLINE
              </label>
              <input
                type="text"
                value={formData.subheadline}
                onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
                placeholder="Somehow, the perfect combination."
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white serif italic text-sm focus:outline-none focus:border-white/50"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="text-[10px] font-mono tracking-widest uppercase opacity-40 hover:opacity-100 flex items-center gap-1.5 transition-opacity cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>RESET TO DEFAULT</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-5 py-2.5 glass text-[10px] font-mono tracking-widest uppercase text-neutral-300 hover:text-white transition-all cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-initial px-7 py-2.5 bg-white text-black hover:bg-neutral-200 font-semibold text-[10px] font-mono tracking-widest uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl"
              >
                {showSavedFeedback ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>SAVED PHOTO &amp; DETAILS!</span>
                  </>
                ) : (
                  <span>SAVE CHANGES</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
