import React, { useState, useRef, useEffect } from 'react';
import { RandomSnippet } from '../types';
import { compressImage } from '../utils/imageCompressor';
import { X, Plus, Trash2, Upload, MessageSquare, Receipt, Camera, Mic } from 'lucide-react';
import { motion } from 'motion/react';

interface EditRandomStuffModalProps {
  isOpen: boolean;
  onClose: () => void;
  snippets: RandomSnippet[];
  onSaveSnippets: (snippets: RandomSnippet[]) => void;
}

export const EditRandomStuffModal: React.FC<EditRandomStuffModalProps> = ({
  isOpen,
  onClose,
  snippets,
  onSaveSnippets
}) => {
  const [snippetList, setSnippetList] = useState<RandomSnippet[]>(snippets);
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>(snippets[0]?.id || '');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (snippets && snippets.length > 0) {
      setSnippetList(JSON.parse(JSON.stringify(snippets)));
      if (!selectedSnippetId || !snippets.some((s) => s.id === selectedSnippetId)) {
        setSelectedSnippetId(snippets[0].id);
      }
    }
  }, [snippets, isOpen]);

  if (!isOpen) return null;

  const currentSnippet = snippetList.find((s) => s.id === selectedSnippetId) || snippetList[0];

  const updateCurrentSnippet = (updates: Partial<RandomSnippet>) => {
    if (!currentSnippet) return;
    setSnippetList((prev) =>
      prev.map((s) => (s.id === currentSnippet.id ? { ...s, ...updates } : s))
    );
  };

  const handleAddNewSnippet = () => {
    const newId = `rnd-${Date.now()}`;
    const newSnippet: RandomSnippet = {
      id: newId,
      type: 'chat',
      title: 'New Random Artifact',
      subtitle: 'Memories from a random Tuesday',
      content: 'Friend 1: Where are you guys?\nFriend 2: On the roof with snacks!\nFriend 1: On my way.',
      date: 'AUG 12',
      metadata: 'iMessage screenshot'
    };
    setSnippetList([...snippetList, newSnippet]);
    setSelectedSnippetId(newId);
  };

  const handleDeleteSnippet = (id: string) => {
    if (snippetList.length <= 1) {
      alert('You must keep at least one artifact.');
      return;
    }
    const remaining = snippetList.filter((s) => s.id !== id);
    setSnippetList(remaining);
    setSelectedSnippetId(remaining[0].id);
  };

  const handleImageUpload = async (file: File) => {
    try {
      const compressed = await compressImage(file, 1000, 0.8);
      updateCurrentSnippet({ imageUrl: compressed });
    } catch (err) {
      console.error('Error compressing artifact image:', err);
    }
  };

  const handleSave = () => {
    onSaveSnippets(snippetList);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl">
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative z-10 w-full max-w-3xl glass p-6 sm:p-8 border border-white/15 shadow-2xl bg-neutral-950/95 max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-6">
          <div>
            <p className="text-[10px] tracking-super-wide opacity-40 uppercase font-mono mb-1">
              EDIT SECTION &bull; THE RANDOM STUFF (SCRAPBOOK)
            </p>
            <h3 className="text-xl sm:text-2xl font-light text-white tracking-wider uppercase">
              EDIT RANDOM ARTIFACTS
            </h3>
            <p className="text-xs text-neutral-400 font-sans mt-1">
              Customize text chats, midnight diner receipts, blurry polaroids, and inside joke voice notes.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 glass text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-white/10">
          {snippetList.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setSelectedSnippetId(s.id)}
              className={`px-3.5 py-2 text-[10px] font-mono uppercase tracking-widest flex-shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                currentSnippet?.id === s.id
                  ? 'bg-white text-black font-semibold'
                  : 'glass text-neutral-400 hover:text-white'
              }`}
            >
              <span>{s.title || `Artifact ${idx + 1}`}</span>
            </button>
          ))}

          <button
            onClick={handleAddNewSnippet}
            className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest flex-shrink-0 border border-dashed border-white/30 hover:border-white text-amber-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3 h-3" />
            <span>Add Artifact</span>
          </button>
        </div>

        {currentSnippet && (
          <div className="space-y-6">
            {/* Artifact Type */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-2">
                ARTIFACT TYPE
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['chat', 'receipt', 'polaroid', 'voice-note'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateCurrentSnippet({ type })}
                    className={`py-2 px-3 text-xs font-mono uppercase border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      currentSnippet.type === type
                        ? 'bg-white text-black border-white font-semibold'
                        : 'glass text-neutral-400 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {type === 'chat' && <MessageSquare className="w-3.5 h-3.5" />}
                    {type === 'receipt' && <Receipt className="w-3.5 h-3.5" />}
                    {type === 'polaroid' && <Camera className="w-3.5 h-3.5" />}
                    {type === 'voice-note' && <Mic className="w-3.5 h-3.5" />}
                    <span>{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                  TITLE
                </label>
                <input
                  type="text"
                  value={currentSnippet.title}
                  onChange={(e) => updateCurrentSnippet({ title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                  SUBTITLE / LOCATION
                </label>
                <input
                  type="text"
                  value={currentSnippet.subtitle || ''}
                  onChange={(e) => updateCurrentSnippet({ subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white serif italic text-sm"
                />
              </div>
            </div>

            {/* Content Multi-line */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                CONTENT (CHAT LINES, RECEIPT ITEMS, OR NOTE)
              </label>
              <textarea
                rows={4}
                value={currentSnippet.content}
                onChange={(e) => updateCurrentSnippet({ content: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white font-mono text-xs leading-relaxed"
                placeholder="Line 1&#10;Line 2&#10;Line 3"
              />
            </div>

            {/* If Polaroid, Image upload */}
            {currentSnippet.type === 'polaroid' && (
              <div className="p-4 glass border border-white/10 space-y-3">
                <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>POLAROID PHOTO</span>
                </label>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-24 h-24 bg-neutral-900 border border-white/20 overflow-hidden flex-shrink-0">
                    <img
                      src={currentSnippet.imageUrl || './assets/aistudio/maya-portrait-alt.jpg'}
                      alt="Polaroid preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        if (e.dataTransfer.files?.[0]) handleImageUpload(e.dataTransfer.files[0]);
                      }}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2.5 border-2 border-dashed border-white/15 hover:border-white/30 text-center cursor-pointer bg-black/40"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
                        }}
                      />
                      <p className="text-xs text-neutral-300">Upload polaroid snapshot</p>
                    </div>

                    <input
                      type="url"
                      value={currentSnippet.imageUrl || ''}
                      onChange={(e) => updateCurrentSnippet({ imageUrl: e.target.value })}
                      placeholder="Or direct photo URL"
                      className="w-full px-3 py-1.5 bg-black/50 border border-white/15 text-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Date & Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
                  DATE (E.G. 21 JUL)
                </label>
                <input
                  type="text"
                  value={currentSnippet.date}
                  onChange={(e) => updateCurrentSnippet({ date: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 text-white font-mono text-xs uppercase"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
                  FOOTER METADATA / SOURCE
                </label>
                <input
                  type="text"
                  value={currentSnippet.metadata || ''}
                  onChange={(e) => updateCurrentSnippet({ metadata: e.target.value })}
                  placeholder="e.g. iMessage screenshot, Paper receipt in glove box"
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 text-white font-mono text-xs"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDeleteSnippet(currentSnippet.id)}
                className="text-[10px] font-mono uppercase text-red-400 hover:text-red-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Artifact</span>
              </button>

              <div className="flex gap-3">
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
                  Save Artifacts
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
