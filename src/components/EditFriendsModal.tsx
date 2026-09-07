import React, { useState, useRef, useEffect } from 'react';
import { Friend, GroupConfig } from '../types';
import { DEFAULT_GROUP_CONFIG } from '../data/memoriesData';
import { compressImage } from '../utils/imageCompressor';
import { X, Upload, Check, Trash2, Camera, User, Image as ImageIcon, Sparkles, Users, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EditFriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  friends: Friend[];
  groupConfig?: GroupConfig;
  initialFriendId?: string;
  onUpdateFriends: (friends: Friend[], groupConfig?: GroupConfig) => void;
  onResetDefaults: () => void;
}

const SAMPLE_PORTRAITS = [
  { label: 'Sunset Silhouette', url: '/assets/aistudio/maya-portrait-alt.jpg' },
  { label: 'Golden Hour Smile', url: '/assets/aistudio/leo-portrait.jpg' },
  { label: 'Candid Laugh', url: '/assets/aistudio/maya-connected-2.jpg' },
  { label: 'Overlook Gaze', url: '/assets/aistudio/julian-portrait.jpg' },
  { label: '35mm Film Grain', url: '/assets/aistudio/maya-connected-3.jpg' },
  { label: 'Night Neon Chill', url: '/assets/aistudio/julian-connected-3.jpg' },
];

const SAMPLE_GROUP_PHOTOS = [
  { label: 'Golden Hour Laughing Trio', url: '/assets/aistudio/maya-portrait-alt.jpg' },
  { label: 'Overlook Horizon', url: '/assets/aistudio/mem-1-pact.jpg' },
  { label: 'Beach Sunset Sitting', url: '/assets/aistudio/mem-3-pier-jump.jpg' },
  { label: 'Road Trip Convertible', url: '/assets/aistudio/mem-2-coastal-bend.jpg' }
];

export const EditFriendsModal: React.FC<EditFriendsModalProps> = ({
  isOpen,
  onClose,
  friends,
  groupConfig = DEFAULT_GROUP_CONFIG,
  initialFriendId,
  onUpdateFriends,
  onResetDefaults,
}) => {
  const [editableFriends, setEditableFriends] = useState<Friend[]>([]);
  const [editableGroup, setEditableGroup] = useState<GroupConfig>(groupConfig);
  // 'group' or friend index (0, 1, 2)
  const [activeTab, setActiveTab] = useState<'group' | number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showSavedFeedback, setShowSavedFeedback] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const groupFileInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever friends change or modal opens
  useEffect(() => {
    if (friends && friends.length > 0) {
      setEditableFriends(JSON.parse(JSON.stringify(friends)));
      if (initialFriendId) {
        const foundIdx = friends.findIndex((f) => f.id === initialFriendId);
        if (foundIdx !== -1) {
          setActiveTab(foundIdx);
        }
      }
    }
    if (groupConfig) {
      setEditableGroup(JSON.parse(JSON.stringify(groupConfig)));
    }
  }, [friends, groupConfig, initialFriendId, isOpen]);

  if (!isOpen || editableFriends.length === 0) return null;

  const currentFriendIndex = typeof activeTab === 'number' ? activeTab : 0;
  const currentFriend = editableFriends[currentFriendIndex] || editableFriends[0];

  const updateCurrentFriend = (field: keyof Friend, value: string | string[]) => {
    const updated = [...editableFriends];
    updated[currentFriendIndex] = {
      ...updated[currentFriendIndex],
      [field]: value,
    };
    setEditableFriends(updated);
  };

  const updateGroupConfig = (field: keyof GroupConfig, value: string) => {
    setEditableGroup((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFriendFileUpload = async (file: File) => {
    try {
      const compressed = await compressImage(file, 800, 0.8);
      updateCurrentFriend('portrait', compressed);
    } catch (err) {
      console.error('Error compressing portrait image:', err);
    }
  };

  const handleGroupFileUpload = async (file: File) => {
    try {
      const compressed = await compressImage(file, 1400, 0.8);
      updateGroupConfig('groupPhotoUrl', compressed);
    } catch (err) {
      console.error('Error compressing group image:', err);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (activeTab === 'group') {
        handleGroupFileUpload(e.dataTransfer.files[0]);
      } else {
        handleFriendFileUpload(e.dataTransfer.files[0]);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    onUpdateFriends(editableFriends, editableGroup);
    setShowSavedFeedback(true);
    setTimeout(() => {
      setShowSavedFeedback(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    if (window.confirm('Reset all friend names, portraits, and quotes to original defaults?')) {
      onResetDefaults();
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
        className="relative z-10 w-full max-w-3xl glass p-5 sm:p-8 border border-white/15 shadow-2xl bg-neutral-950/95 max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-6">
          <div>
            <p className="text-[10px] tracking-super-wide opacity-40 uppercase font-mono mb-1">
              CUSTOMIZE &bull; THE THREE OF US SECTION
            </p>
            <h3 className="text-xl sm:text-2xl font-light text-white tracking-wider uppercase">
              EDIT THE THREE OF US
            </h3>
            <p className="text-xs text-neutral-400 font-sans mt-1">
              Personalize each friend&apos;s name, portrait photo, role, quote, and the main group photograph.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 glass text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection: Group Cover vs Friend 1, 2, 3 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('group')}
            className={`px-4 py-2.5 text-xs font-mono uppercase tracking-wider flex items-center gap-2 flex-shrink-0 transition-all cursor-pointer ${
              activeTab === 'group'
                ? 'bg-amber-400 text-black font-bold shadow-lg'
                : 'glass text-neutral-300 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>GROUP COVER PHOTO &amp; INTRO</span>
          </button>

          {editableFriends.map((friend, idx) => (
            <button
              key={friend.id}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2.5 text-xs font-mono uppercase tracking-wider flex items-center gap-2 flex-shrink-0 transition-all cursor-pointer ${
                activeTab === idx
                  ? 'bg-white text-black font-bold shadow-lg'
                  : 'glass text-neutral-300 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{friend.name || `FRIEND ${idx + 1}`}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: GROUP COVER PHOTO & INTRO EDITING */}
        {activeTab === 'group' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Group Photograph */}
            <div className="p-4 glass border border-white/10 space-y-4">
              <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>MAIN GROUP PHOTOGRAPH</span>
              </label>

              <div className="flex flex-col sm:flex-row gap-5 items-center">
                {/* Preview Image */}
                <div className="w-full sm:w-48 h-36 bg-neutral-900 border border-white/20 overflow-hidden flex-shrink-0 relative group">
                  <img
                    src={editableGroup.groupPhotoUrl}
                    alt="Group Cover Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-mono uppercase text-white">
                    CURRENT PHOTO
                  </div>
                </div>

                {/* Upload or Drop */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`flex-1 w-full p-4 border border-dashed text-center flex flex-col items-center justify-center transition-colors ${
                    isDragging ? 'border-amber-400 bg-amber-500/10' : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <Upload className="w-5 h-5 text-neutral-400 mb-2" />
                  <p className="text-xs text-neutral-300 font-sans">
                    Drag and drop your group photo here, or
                  </p>
                  <button
                    type="button"
                    onClick={() => groupFileInputRef.current?.click()}
                    className="mt-2 text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 glass text-white hover:bg-white hover:text-black transition-all cursor-pointer"
                  >
                    SELECT PHOTO FROM DEVICE
                  </button>
                  <input
                    ref={groupFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleGroupFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <p className="text-[9px] text-neutral-500 font-mono mt-1">
                    Auto-compressed to load instantly
                  </p>
                </div>
              </div>

              {/* Direct URL input */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
                  OR PASTE GROUP IMAGE URL
                </label>
                <input
                  type="text"
                  value={editableGroup.groupPhotoUrl}
                  onChange={(e) => updateGroupConfig('groupPhotoUrl', e.target.value)}
                  placeholder="/assets/aistudio/..."
                  className="w-full px-3.5 py-2 bg-black/50 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-white/50"
                />
              </div>

              {/* Sample Presets */}
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 block mb-2">
                  OR SELECT PRESET PHOTO:
                </span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_GROUP_PHOTOS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => updateGroupConfig('groupPhotoUrl', preset.url)}
                      className={`text-[9px] font-mono px-2.5 py-1 border transition-all cursor-pointer ${
                        editableGroup.groupPhotoUrl === preset.url
                          ? 'bg-amber-400 text-black border-amber-300 font-bold'
                          : 'glass text-neutral-400 hover:text-white border-white/10'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
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
                  value={editableGroup.headline}
                  onChange={(e) => updateGroupConfig('headline', e.target.value)}
                  placeholder="Three completely different people."
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white text-sm font-light tracking-wide focus:outline-none focus:border-white/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                  ITALIC SUB-HEADLINE
                </label>
                <input
                  type="text"
                  value={editableGroup.subheadline}
                  onChange={(e) => updateGroupConfig('subheadline', e.target.value)}
                  placeholder="Somehow, the perfect combination."
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white serif italic text-sm focus:outline-none focus:border-white/50"
                />
              </div>
            </div>

            {/* Section Description */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                SECTION INTRO PARAGRAPH
              </label>
              <textarea
                rows={3}
                value={editableGroup.description}
                onChange={(e) => updateGroupConfig('description', e.target.value)}
                placeholder="Describe your trio's dynamic..."
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white text-xs font-sans focus:outline-none focus:border-white/50 leading-relaxed resize-none"
              />
            </div>

            {/* Photo Quote / Caption */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                  GROUP PHOTO QUOTE / CAPTION
                </label>
                <input
                  type="text"
                  value={editableGroup.groupPhotoCaption}
                  onChange={(e) => updateGroupConfig('groupPhotoCaption', e.target.value)}
                  placeholder="We never took ourselves seriously, but we took every moment together by heart."
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white serif italic text-sm focus:outline-none focus:border-white/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                  DATE / MILESTONE BADGE
                </label>
                <input
                  type="text"
                  value={editableGroup.statText}
                  onChange={(e) => updateGroupConfig('statText', e.target.value)}
                  placeholder="COLLECTIVE MEMORY • JULY 22"
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-white/50 uppercase"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INDIVIDUAL FRIEND EDITING */}
        {typeof activeTab === 'number' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Portrait Image Uploader */}
            <div className="p-4 glass border border-white/10 space-y-4">
              <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>PORTRAIT PHOTOGRAPH FOR {currentFriend.name.toUpperCase()}</span>
              </label>

              <div className="flex flex-col sm:flex-row gap-5 items-center">
                {/* Preview */}
                <div className="w-24 h-32 bg-neutral-900 border border-white/20 overflow-hidden flex-shrink-0 relative group">
                  <img
                    src={currentFriend.portrait}
                    alt={currentFriend.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[9px] font-mono uppercase text-white">
                    PREVIEW
                  </div>
                </div>

                {/* Upload or Drop */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`flex-1 w-full p-4 border border-dashed text-center flex flex-col items-center justify-center transition-colors ${
                    isDragging ? 'border-amber-400 bg-amber-500/10' : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <Upload className="w-5 h-5 text-neutral-400 mb-2" />
                  <p className="text-xs text-neutral-300 font-sans">
                    Drop {currentFriend.name}&apos;s photo here, or
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 glass text-white hover:bg-white hover:text-black transition-all cursor-pointer"
                  >
                    SELECT PHOTO FROM DEVICE
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFriendFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <p className="text-[9px] text-neutral-500 font-mono mt-1">
                    Auto-optimized for instant capsule loading
                  </p>
                </div>
              </div>

              {/* Direct URL input */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
                  OR PASTE IMAGE URL
                </label>
                <input
                  type="text"
                  value={currentFriend.portrait}
                  onChange={(e) => updateCurrentFriend('portrait', e.target.value)}
                  placeholder="/assets/aistudio/..."
                  className="w-full px-3.5 py-2 bg-black/50 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-white/50"
                />
              </div>

              {/* Sample Presets */}
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 block mb-2">
                  OR SELECT A CINEMATIC PRESET:
                </span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_PORTRAITS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => updateCurrentFriend('portrait', preset.url)}
                      className={`text-[9px] font-mono px-2.5 py-1 border transition-all cursor-pointer ${
                        currentFriend.portrait === preset.url
                          ? 'bg-amber-400 text-black border-amber-300 font-bold'
                          : 'glass text-neutral-400 hover:text-white border-white/10'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Friend Name & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                  NAME
                </label>
                <input
                  type="text"
                  value={currentFriend.name}
                  onChange={(e) => updateCurrentFriend('name', e.target.value)}
                  placeholder="e.g. Julian"
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white uppercase tracking-wider text-sm focus:outline-none focus:border-white/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                  ROLE / ARCHETYPE
                </label>
                <input
                  type="text"
                  value={currentFriend.role}
                  onChange={(e) => updateCurrentFriend('role', e.target.value)}
                  placeholder="e.g. The Spontaneous Catalyst"
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-white/50"
                />
              </div>
            </div>

            {/* Signature Quote */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                SIGNATURE QUOTE
              </label>
              <input
                type="text"
                value={currentFriend.quote}
                onChange={(e) => updateCurrentFriend('quote', e.target.value)}
                placeholder="e.g. We don't need a map, just keep driving toward the orange sky."
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white serif italic text-sm focus:outline-none focus:border-white/50"
              />
            </div>

            {/* Personality Narrative */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                PERSONALITY &amp; VIBE DESCRIPTION
              </label>
              <textarea
                rows={3}
                value={currentFriend.personality}
                onChange={(e) => updateCurrentFriend('personality', e.target.value)}
                placeholder="Tell what made them unforgettable during these two months..."
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white text-xs font-sans focus:outline-none focus:border-white/50 leading-relaxed resize-none"
              />
            </div>

            {/* Vibe Tags */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                VIBE TAGS (COMMA SEPARATED)
              </label>
              <input
                type="text"
                value={currentFriend.vibeTags.join(', ')}
                onChange={(e) => {
                  const tags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                  updateCurrentFriend('vibeTags', tags);
                }}
                placeholder="35MM FILM, PLAYLIST CURATOR, ALWAYS LATE"
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-white/50 uppercase tracking-wider"
              />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-6 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="text-[10px] font-mono tracking-widest uppercase opacity-50 hover:opacity-100 flex items-center gap-1.5 transition-opacity cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>RESET TO DEFAULTS</span>
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
              type="button"
              onClick={handleSave}
              className="flex-1 sm:flex-initial px-7 py-2.5 bg-white text-black hover:bg-neutral-200 font-semibold text-[10px] font-mono tracking-widest uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl"
            >
              {showSavedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>SAVED TO CAPSULE</span>
                </>
              ) : (
                <span>SAVE CHANGES</span>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
