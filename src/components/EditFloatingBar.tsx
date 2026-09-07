import React, { useState, useRef } from 'react';
import { 
  Pencil, 
  Eye, 
  Download, 
  Upload, 
  RotateCcw, 
  Sparkles, 
  ChevronUp, 
  ChevronDown, 
  Camera, 
  Users, 
  BookOpen, 
  Film, 
  MessageSquare, 
  Quote, 
  Heart,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EditFloatingBarProps {
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onOpenEditHero: () => void;
  onOpenEditFriends: () => void;
  onOpenEditChapters: () => void;
  onOpenAddMemory: () => void;
  onOpenEditVideos: () => void;
  onOpenEditRandomStuff: () => void;
  onOpenEditQuotes: () => void;
  onOpenEditFinalScene: () => void;
  onExportBackup: () => void;
  onImportBackup: (json: string) => void;
  onResetAll: () => void;
}

export const EditFloatingBar: React.FC<EditFloatingBarProps> = ({
  isEditMode,
  onToggleEditMode,
  onOpenEditHero,
  onOpenEditFriends,
  onOpenEditChapters,
  onOpenAddMemory,
  onOpenEditVideos,
  onOpenEditRandomStuff,
  onOpenEditQuotes,
  onOpenEditFinalScene,
  onExportBackup,
  onImportBackup,
  onResetAll
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        onImportBackup(content);
        setImportSuccess(true);
        setTimeout(() => setImportSuccess(false), 2000);
      }
    };
    reader.readAsText(file);
    // Reset so same file can be re-uploaded if needed
    e.target.value = '';
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-auto max-w-[96vw]">
      <motion.div
        layout
        className="glass border border-amber-400/30 bg-neutral-950/90 backdrop-blur-xl shadow-2xl rounded-full p-1.5 sm:p-2 flex items-center gap-1.5 sm:gap-3 text-white text-xs font-mono"
      >
        {/* Toggle Mode Button */}
        <button
          onClick={onToggleEditMode}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
            isEditMode
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'bg-white/10 hover:bg-white/20 text-neutral-300'
          }`}
          title="Toggle editing controls on and off across the whole website"
        >
          {isEditMode ? (
            <>
              <Pencil className="w-3.5 h-3.5 fill-black" />
              <span>EDIT MODE: ON</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>PREVIEW MODE</span>
            </>
          )}
        </button>

        {/* When Edit Mode is active, show quick jump buttons & actions */}
        {isEditMode && (
          <>
            <div className="hidden md:flex items-center gap-1 border-l border-white/10 pl-2">
              <button
                onClick={onOpenEditHero}
                className="px-2.5 py-1.5 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition-colors text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                title="Edit Hero Headline & Cover Image"
              >
                <span>Hero</span>
              </button>

              <button
                onClick={onOpenEditFriends}
                className="px-2.5 py-1.5 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition-colors text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                title="Edit Friends Portraits & Backstories"
              >
                <span>Friends</span>
              </button>

              <button
                onClick={onOpenEditChapters}
                className="px-2.5 py-1.5 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition-colors text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                title="Edit Chapter Story Summaries"
              >
                <span>Chapters</span>
              </button>

              <button
                onClick={onOpenAddMemory}
                className="px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                title="Add New Memory with Photo Upload"
              >
                <span>+ Memory</span>
              </button>

              <button
                onClick={onOpenEditVideos}
                className="px-2.5 py-1.5 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition-colors text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                title="Edit Video Memories"
              >
                <span>Videos</span>
              </button>

              <button
                onClick={onOpenEditRandomStuff}
                className="px-2.5 py-1.5 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition-colors text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                title="Edit Receipts, Chats & Polaroids"
              >
                <span>Scrapbook</span>
              </button>

              <button
                onClick={onOpenEditQuotes}
                className="px-2.5 py-1.5 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition-colors text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                title="Edit Quotes Wall"
              >
                <span>Quotes</span>
              </button>

              <button
                onClick={onOpenEditFinalScene}
                className="px-2.5 py-1.5 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition-colors text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                title="Edit Final Scene Epilogue"
              >
                <span>Epilogue</span>
              </button>
            </div>

            {/* Backup / Export & Import controls */}
            <div className="flex items-center gap-1 border-l border-white/10 pl-2">
              <button
                onClick={onExportBackup}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-full glass hover:bg-white/20 text-neutral-300 hover:text-white transition-all text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                title="Export all your edits to a JSON backup file"
              >
                <Download className="w-3 h-3 text-amber-300" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-full glass hover:bg-white/20 text-neutral-300 hover:text-white transition-all text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                title="Import JSON backup file"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json,application/json"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {importSuccess ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="hidden sm:inline text-emerald-400">Restored</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3 h-3 text-amber-300" />
                    <span className="hidden sm:inline">Import</span>
                  </>
                )}
              </button>

              <button
                onClick={onResetAll}
                className="p-1.5 sm:px-2 sm:py-1.5 rounded-full hover:bg-red-500/20 text-neutral-400 hover:text-red-300 transition-colors text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                title="Reset everything to factory defaults"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
