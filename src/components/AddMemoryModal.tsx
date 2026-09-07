import React, { useState } from 'react';
import { Memory, ChapterId, Friend } from '../types';
import { compressImage } from '../utils/imageCompressor';
import { X, ImagePlus, Upload, Sparkles, Check, Trash2 } from 'lucide-react';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  friends: Friend[];
  onAddMemory: (newMemory: Memory) => void;
  onUpdateFriends: (updatedFriends: Friend[]) => void;
  onResetDefaults: () => void;
}

export const AddMemoryModal: React.FC<AddMemoryModalProps> = ({
  isOpen,
  onClose,
  friends,
  onAddMemory,
  onUpdateFriends,
  onResetDefaults
}) => {
  const [activeTab, setActiveTab] = useState<'memory' | 'friends'>('memory');

  // New Memory Form State
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [story, setStory] = useState('');
  const [date, setDate] = useState('14 JUL');
  const [time, setTime] = useState('4:15 PM');
  const [location, setLocation] = useState('The Pier');
  const [chapter, setChapter] = useState<ChapterId>('THE LITTLE MOMENTS');
  const [imageUrl, setImageUrl] = useState('');
  const [isVideo, setIsVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  // Friends customization state
  const [editableFriends, setEditableFriends] = useState<Friend[]>(friends);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 1400, 0.82);
        setImageUrl(compressed);
      } catch (err) {
        console.error('Error compressing upload in AddMemoryModal:', err);
      }
    }
  };

  const handleSubmitMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || (!imageUrl && !videoUrl)) return;

    const newMem: Memory = {
      id: `custom-mem-${Date.now()}`,
      title,
      caption: caption || title,
      story,
      date: date || '12 AUG',
      time: time || '3:30 PM',
      location: location || 'Secret Spot',
      type: isVideo ? 'video' : 'photo',
      imageUrl: imageUrl || '/assets/aistudio/mem-1-pact.jpg',
      videoUrl: isVideo ? videoUrl : undefined,
      chapter,
      people: friends.map((f) => f.name),
      isRandomFavorite: true,
      isVideo
    };

    onAddMemory(newMem);
    onClose();
  };

  const handleSaveFriends = () => {
    onUpdateFriends(editableFriends);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl glass p-6 sm:p-8 border border-white/15 shadow-2xl bg-neutral-950/95 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 glass text-white hover:bg-white hover:text-black transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('memory')}
            className={`px-4 py-2 text-[10px] tracking-widest uppercase transition-all ${
              activeTab === 'memory'
                ? 'bg-white text-black font-semibold'
                : 'glass text-neutral-400 hover:text-white'
            }`}
          >
            ADD A MEMORY
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-4 py-2 text-[10px] tracking-widest uppercase transition-all ${
              activeTab === 'friends'
                ? 'bg-white text-black font-semibold'
                : 'glass text-neutral-400 hover:text-white'
            }`}
          >
            EDIT THE THREE OF US
          </button>
        </div>

        {activeTab === 'memory' ? (
          <form onSubmit={handleSubmitMemory} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-neutral-400 text-[9px] uppercase tracking-widest mb-1.5">
                Memory Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sunset run to the overlook"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/40 font-sans text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-400 text-[9px] uppercase tracking-widest mb-1.5">
                  Date (e.g. 14 JUL)
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-neutral-400 text-[9px] uppercase tracking-widest mb-1.5">
                  Time (e.g. 4:15 PM)
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 text-[9px] uppercase tracking-widest mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. South Pier Barnacles"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40 text-xs font-sans"
              />
            </div>

            <div>
              <label className="block text-neutral-400 text-[9px] uppercase tracking-widest mb-1.5">
                Chapter
              </label>
              <select
                value={chapter}
                onChange={(e) => setChapter(e.target.value as ChapterId)}
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 text-white focus:outline-none focus:border-white/40 text-xs font-mono"
              >
                <option value="THE BEGINNING">THE BEGINNING</option>
                <option value="THEN THIS HAPPENED...">THEN THIS HAPPENED...</option>
                <option value="THE CHAOS">THE CHAOS</option>
                <option value="THE LITTLE MOMENTS">THE LITTLE MOMENTS</option>
                <option value="THE LAST DAYS">THE LAST DAYS</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 text-[9px] uppercase tracking-widest mb-1.5">
                Short Caption
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. We were supposed to study."
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40 serif text-xs italic"
              />
            </div>

            <div>
              <label className="block text-neutral-400 text-[9px] uppercase tracking-widest mb-1.5">
                Full Backstory (Optional)
              </label>
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="What really happened that day..."
                rows={2}
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40 font-sans text-xs"
              />
            </div>

            {/* Photo / Video Upload */}
            <div className="pt-2">
              <label className="block text-neutral-400 text-[9px] uppercase tracking-widest mb-2">
                Photo Upload or Image URL
              </label>

              <div className="flex items-center gap-3">
                <label className="cursor-pointer px-4 py-2 glass text-white hover:bg-white hover:text-black flex items-center gap-2 text-[10px] tracking-widest uppercase transition-all">
                  <Upload className="w-3.5 h-3.5" />
                  <span>File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-neutral-500 font-mono text-[10px]">or</span>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste direct Image URL..."
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 truncate font-mono"
                />
              </div>

              {/* Preview image */}
              {imageUrl && (
                <div className="mt-3 relative h-28 border border-white/15 overflow-hidden">
                  <img src={imageUrl} alt="Upload preview" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="text-[10px] tracking-widest uppercase text-neutral-400 hover:text-white"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-white text-black hover:bg-neutral-200 font-semibold text-[10px] tracking-widest uppercase flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ImagePlus className="w-4 h-4" />
                <span>SAVE TO CAPSULE</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              Personalize the names, roles, or quotes for each of the three friends:
            </p>

            {editableFriends.map((f, idx) => (
              <div key={f.id} className="p-4 glass border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono opacity-50 uppercase tracking-widest">
                    FRIEND 0{idx + 1}
                  </span>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-14 h-18 bg-neutral-900 border border-white/20 overflow-hidden flex-shrink-0">
                    <img src={f.portrait} alt={f.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={f.name}
                        onChange={(e) => {
                          const updated = [...editableFriends];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          setEditableFriends(updated);
                        }}
                        placeholder="Name"
                        className="px-3 py-1.5 bg-black/40 border border-white/10 text-white text-xs font-mono"
                      />
                      <input
                        type="text"
                        value={f.role}
                        onChange={(e) => {
                          const updated = [...editableFriends];
                          updated[idx] = { ...updated[idx], role: e.target.value };
                          setEditableFriends(updated);
                        }}
                        placeholder="Role"
                        className="px-3 py-1.5 bg-black/40 border border-white/10 text-white text-xs font-mono"
                      />
                    </div>
                    <input
                      type="url"
                      value={f.portrait}
                      onChange={(e) => {
                        const updated = [...editableFriends];
                        updated[idx] = { ...updated[idx], portrait: e.target.value };
                        setEditableFriends(updated);
                      }}
                      placeholder="Portrait Photo URL"
                      className="w-full px-3 py-1.5 bg-black/40 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <input
                  type="text"
                  value={f.quote}
                  onChange={(e) => {
                    const updated = [...editableFriends];
                    updated[idx] = { ...updated[idx], quote: e.target.value };
                    setEditableFriends(updated);
                  }}
                  placeholder="Their trademark quote"
                  className="w-full px-3 py-1.5 bg-black/40 border border-white/10 text-white text-xs serif italic"
                />
              </div>
            ))}

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  onResetDefaults();
                  onClose();
                }}
                className="text-[10px] font-mono tracking-widest uppercase opacity-60 hover:opacity-100 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>RESET DEFAULTS</span>
              </button>

              <button
                type="button"
                onClick={handleSaveFriends}
                className="px-6 py-2.5 bg-white text-black hover:bg-neutral-200 font-semibold text-[10px] font-mono tracking-widest uppercase cursor-pointer transition-all"
              >
                SAVE CHANGES
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
