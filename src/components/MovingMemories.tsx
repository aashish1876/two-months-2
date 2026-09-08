import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Memory } from '../types';
import { VIDEO_MEMORIES } from '../data/memoriesData';
import { Play, Pause, Volume2, VolumeX, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VideoPlayerModalProps {
  activeVideo: Memory;
  onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = React.memo(({ activeVideo, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
        vid.play().catch(() => setIsPlaying(false));
    }
  }, [activeVideo]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
    >
      <button onClick={onClose} className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all">
        <X className="w-5 h-5" />
      </button>

      <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden glass-panel border border-white/15 shadow-2xl flex flex-col">
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
            <video
                ref={videoRef}
                src={activeVideo.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                poster={activeVideo.imageUrl}
                playsInline
                muted={isMuted}
                loop
                preload="metadata"
                onTimeUpdate={(e) => {
                    const vid = e.target as HTMLVideoElement;
                    setCurrentTime(vid.currentTime);
                    if (progressRef.current) progressRef.current.style.width = `${(vid.currentTime / (vid.duration || 30)) * 100}%`;
                }}
                onLoadedMetadata={(e) => setDuration((e.target as HTMLVideoElement).duration || 30)}
                className="w-full h-full object-contain"
            />
        </div>
        <div className="p-4 sm:p-6 bg-neutral-950/80 backdrop-blur-xl border-t border-white/10 flex flex-col gap-3">
             <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden relative">
                  <div ref={progressRef} className="bg-amber-400 h-full rounded-full transition-all duration-100" style={{ width: '0%' }} />
             </div>
             <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button onClick={togglePlay} className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer">
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>
                    <button onClick={toggleMute} className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer">
                      {isMuted ? <VolumeX className="w-4 h-4 text-neutral-400" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
                    </button>
                  </div>
             </div>
        </div>
      </div>
    </motion.div>
  );
});

export const MovingMemories: React.FC<any> = ({ customVideos, videos }) => {
  const allVideos = React.useMemo(() => {
    const combined = videos || (customVideos ? [...VIDEO_MEMORIES, ...customVideos] : VIDEO_MEMORIES);
    const seen = new Set();
    return combined.filter(v => {
        if(seen.has(v.id)) return false;
        seen.add(v.id);
        return true;
    });
  }, [videos, customVideos]);

  const [activeVideo, setActiveVideo] = useState<Memory | null>(null);

  return (
    <section id="videos" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {allVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: index * 0.15 }}
            className="group cursor-pointer flex flex-col justify-between glass p-2.5 border border-white/10 hover:border-white/20 shadow-2xl"
            onClick={() => setActiveVideo(video)}
          >
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-950 border border-white/10">
              <img src={video.imageUrl} loading="lazy" decoding="async" alt={video.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
            {/* ... caption ... */}
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {activeVideo && <VideoPlayerModal activeVideo={activeVideo} onClose={() => setActiveVideo(null)} />}
      </AnimatePresence>
    </section>
  );
};
