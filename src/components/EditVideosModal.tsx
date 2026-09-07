import React, { useState, useRef, useEffect } from 'react';
import { Memory } from '../types';
import { compressImage } from '../utils/imageCompressor';
import { X, Plus, Trash2, Video, Upload, Check, Play } from 'lucide-react';
import { motion } from 'motion/react';

interface EditVideosModalProps {
  isOpen: boolean;
  onClose: () => void;
  videos: Memory[];
  onSaveVideos: (videos: Memory[]) => void;
}

const SAMPLE_VIDEO_PRESETS = [
  { label: 'Sample Campfire / Blaze (Google GTV)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
  { label: 'Sample Road Trip Escapes', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
  { label: 'Sample Ocean Fun', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' }
];

export const EditVideosModal: React.FC<EditVideosModalProps> = ({
  isOpen,
  onClose,
  videos,
  onSaveVideos
}) => {
  const [videoList, setVideoList] = useState<Memory[]>(videos);
  const [selectedVideoId, setSelectedVideoId] = useState<string>(videos[0]?.id || '');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (videos && videos.length > 0) {
      setVideoList(JSON.parse(JSON.stringify(videos)));
      if (!selectedVideoId || !videos.some((v) => v.id === selectedVideoId)) {
        setSelectedVideoId(videos[0].id);
      }
    }
  }, [videos, isOpen]);

  if (!isOpen) return null;

  const currentVideo = videoList.find((v) => v.id === selectedVideoId) || videoList[0];

  const updateCurrentVideo = (updates: Partial<Memory>) => {
    if (!currentVideo) return;
    setVideoList((prev) =>
      prev.map((v) => (v.id === currentVideo.id ? { ...v, ...updates } : v))
    );
  };

  const handleAddNewVideo = () => {
    const newId = `vid-${Date.now()}`;
    const newVideo: Memory = {
      id: newId,
      title: 'New Moving Memory',
      caption: 'Describe this moment in motion...',
      date: 'AUG 15',
      time: '6:30 PM',
      location: 'Scenic Viewpoint',
      type: 'video',
      isVideo: true,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      imageUrl: './assets/aistudio/mem-8-desert-stars.jpg',
      duration: '0:30',
      aspect: 'landscape',
      chapter: 'THE BEGINNING',
      people: ['Julian', 'Maya', 'Leo']
    };
    setVideoList([...videoList, newVideo]);
    setSelectedVideoId(newId);
  };

  const handleDeleteVideo = (id: string) => {
    if (videoList.length <= 1) {
      alert('You must keep at least one video in the section.');
      return;
    }
    const remaining = videoList.filter((v) => v.id !== id);
    setVideoList(remaining);
    setSelectedVideoId(remaining[0].id);
  };

  const handleThumbnailUpload = async (file: File) => {
    try {
      const compressed = await compressImage(file, 1200, 0.82);
      updateCurrentVideo({ imageUrl: compressed });
    } catch (err) {
      console.error('Error compressing video poster:', err);
    }
  };

  const handleSave = () => {
    onSaveVideos(videoList);
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
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-6">
          <div>
            <p className="text-[10px] tracking-super-wide opacity-40 uppercase font-mono mb-1">
              EDIT SECTION &bull; MOVING MEMORIES (VIDEOS)
            </p>
            <h3 className="text-xl sm:text-2xl font-light text-white tracking-wider uppercase">
              EDIT VIDEO MOMENTS
            </h3>
            <p className="text-xs text-neutral-400 font-sans mt-1">
              Update titles, video stream URLs, poster covers, dates, and locations.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 glass text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video selector list */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-white/10">
          {videoList.map((v, idx) => (
            <button
              key={v.id}
              onClick={() => setSelectedVideoId(v.id)}
              className={`px-4 py-2 text-[10px] font-mono uppercase tracking-widest flex-shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
                currentVideo?.id === v.id
                  ? 'bg-white text-black font-semibold'
                  : 'glass text-neutral-400 hover:text-white'
              }`}
            >
              <Video className="w-3 h-3" />
              <span>{v.title || `Video ${idx + 1}`}</span>
            </button>
          ))}

          <button
            onClick={handleAddNewVideo}
            className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest flex-shrink-0 border border-dashed border-white/30 hover:border-white text-amber-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3 h-3" />
            <span>Add Video</span>
          </button>
        </div>

        {currentVideo && (
          <div className="space-y-6">
            {/* Title & Caption */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                  VIDEO TITLE
                </label>
                <input
                  type="text"
                  value={currentVideo.title}
                  onChange={(e) => updateCurrentVideo({ title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                  DURATION (E.G. 0:34)
                </label>
                <input
                  type="text"
                  value={currentVideo.duration || '0:30'}
                  onChange={(e) => updateCurrentVideo({ duration: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                CAPTION / NOTE
              </label>
              <textarea
                rows={2}
                value={currentVideo.caption}
                onChange={(e) => updateCurrentVideo({ caption: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white text-xs leading-relaxed resize-none"
              />
            </div>

            {/* Video File / Stream URL */}
            <div className="p-4 glass border border-white/10 space-y-3">
              <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 flex items-center gap-2">
                <Play className="w-3.5 h-3.5 text-amber-400" />
                <span>VIDEO URL (.MP4 DIRECT LINK OR STORAGE LINK)</span>
              </label>
              <input
                type="url"
                value={currentVideo.videoUrl || ''}
                onChange={(e) => updateCurrentVideo({ videoUrl: e.target.value })}
                placeholder="https://example.com/video.mp4"
                className="w-full px-3 py-2 bg-black/50 border border-white/15 text-white text-xs font-mono"
              />
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[9px] font-mono text-neutral-400">Sample presets:</span>
                {SAMPLE_VIDEO_PRESETS.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => updateCurrentVideo({ videoUrl: p.url })}
                    className="text-[9px] font-mono px-2 py-0.5 glass text-neutral-300 hover:text-white cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Thumbnail Poster */}
            <div className="p-4 glass border border-white/10 space-y-3">
              <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 flex items-center gap-2">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>POSTER THUMBNAIL COVER</span>
              </label>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-32 h-20 bg-neutral-900 border border-white/20 overflow-hidden flex-shrink-0">
                  <img
                    src={currentVideo.imageUrl}
                    alt={currentVideo.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 w-full space-y-2">
                  <div
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files?.[0]) handleThumbnailUpload(e.dataTransfer.files[0]);
                    }}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-2.5 border-2 border-dashed text-center cursor-pointer transition-all ${
                      isDragging ? 'border-amber-400 bg-amber-400/10' : 'border-white/15 hover:border-white/30 bg-black/40'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleThumbnailUpload(e.target.files[0]);
                      }}
                    />
                    <p className="text-xs text-neutral-300">Upload new poster image</p>
                  </div>

                  <input
                    type="url"
                    value={currentVideo.imageUrl}
                    onChange={(e) => updateCurrentVideo({ imageUrl: e.target.value })}
                    placeholder="Or poster image URL"
                    className="w-full px-3 py-1.5 bg-black/50 border border-white/15 text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Date & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
                  DATE (E.G. 14 JUL)
                </label>
                <input
                  type="text"
                  value={currentVideo.date}
                  onChange={(e) => updateCurrentVideo({ date: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 text-white font-mono text-xs uppercase"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
                  LOCATION
                </label>
                <input
                  type="text"
                  value={currentVideo.location}
                  onChange={(e) => updateCurrentVideo({ location: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 text-white font-mono text-xs"
                />
              </div>
            </div>

            {/* Delete button */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDeleteVideo(currentVideo.id)}
                className="text-[10px] font-mono uppercase text-red-400 hover:text-red-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete This Video</span>
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
                  Save Videos
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
