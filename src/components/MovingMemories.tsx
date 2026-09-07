import React, { useState } from 'react';
import { Memory } from '../types';
import { VIDEO_MEMORIES } from '../data/memoriesData';
import { Play, Pause, Volume2, VolumeX, X, Clock, MapPin, Film, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MovingMemoriesProps {
  customVideos?: Memory[];
  videos?: Memory[];
}

export const MovingMemories: React.FC<MovingMemoriesProps> = ({
  customVideos,
  videos,
}) => {
  const allVideos = videos || (customVideos ? [...VIDEO_MEMORIES, ...customVideos] : VIDEO_MEMORIES);
  const [activeVideo, setActiveVideo] = useState<Memory | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const handleOpenVideo = (video: Memory) => {
    setActiveVideo(video);
    setIsPlaying(true);
    setIsMuted(true); // per prompt: "Do not autoplay videos with sound"
  };

  const handleCloseVideo = () => {
    setActiveVideo(null);
  };

  return (
    <section id="videos" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Ambience */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <p className="text-[10px] tracking-super-wide opacity-40 uppercase font-mono mb-4">
          CINEMATIC ARCHIVE &bull; MOTION &amp; SOUND
        </p>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light text-[#F5F5F5] tracking-tight">
          SOME MEMORIES MOVE.
        </h2>
        <p className="mt-4 text-xs sm:text-sm tracking-widest uppercase opacity-60 font-sans max-w-md mx-auto">
          A photograph captures a fraction of a second. A moving memory brings back the sound of the wind, the engine, and the laughing.
        </p>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {allVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: index * 0.15 }}
            className="group cursor-pointer flex flex-col justify-between glass p-2.5 border border-white/10 hover:border-white/20 transition-all duration-500 shadow-2xl"
            onClick={() => handleOpenVideo(video)}
          >
            {/* Thumbnail Box */}
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-950 border border-white/10">
              <img
                src={video.imageUrl}
                alt={video.title}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

              {/* Center Play Button with pulse glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>

              {/* Date & Duration Tags */}
              <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/70 backdrop-blur-md border border-white/15 text-[9px] font-mono tracking-widest text-neutral-200 uppercase">
                {video.date}
              </div>

              {video.duration && (
                <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-mono opacity-80 text-neutral-300">
                  {video.duration}
                </div>
              )}
            </div>

            {/* Video Caption & Metadata */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[9px] font-mono opacity-40 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-neutral-400" />
                  <span>{video.location}</span>
                </p>
                <h3 className="text-base sm:text-lg font-light text-white tracking-wider uppercase">
                  {video.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm serif italic opacity-80 line-clamp-2">
                  “{video.caption}”
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[9px] font-mono opacity-60 tracking-widest uppercase">
                <span>WITH: {video.people.join(' &bull; ')}</span>
                <span className="opacity-80 group-hover:opacity-100 flex items-center gap-1 transition-opacity">PLAY CLIP &rarr;</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fullscreen Video Player Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
          >
            {/* Close Button */}
            <button
              onClick={handleCloseVideo}
              className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content Box */}
            <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden glass-panel border border-white/15 shadow-2xl flex flex-col">
              <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                <video
                  src={activeVideo.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                  poster={activeVideo.imageUrl}
                  playsInline
                  muted={isMuted}
                  loop
                  onTimeUpdate={(e) => setCurrentTime((e.target as HTMLVideoElement).currentTime)}
                  onLoadedMetadata={(e) => {
                    const vid = e.target as HTMLVideoElement;
                    setDuration(vid.duration || 30);
                    vid.play()
                      .then(() => setIsPlaying(true))
                      .catch(() => setIsPlaying(false));
                  }}
                  onError={() => {
                    setIsPlaying(false);
                  }}
                  id="fullscreen-active-video"
                  className="w-full h-full object-contain"
                />

                {/* Video Watermark stamp */}
                <div className="absolute top-4 left-4 pointer-events-none text-[10px] font-mono tracking-widest text-white/50 bg-black/50 px-2.5 py-1 rounded border border-white/10">
                  {activeVideo.date} &bull; {activeVideo.location.toUpperCase()}
                </div>
              </div>

              {/* Glass Controls Bar */}
              <div className="p-4 sm:p-6 bg-neutral-950/80 backdrop-blur-xl border-t border-white/10 flex flex-col gap-3">
                {/* Progress bar */}
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden relative">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-100"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const vid = document.getElementById('fullscreen-active-video') as HTMLVideoElement;
                        if (vid) {
                          if (vid.paused) {
                            vid.play()
                              .then(() => setIsPlaying(true))
                              .catch(() => setIsPlaying(false));
                          } else {
                            vid.pause();
                            setIsPlaying(false);
                          }
                        }
                      }}
                      className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>

                    <button
                      onClick={() => {
                        const vid = document.getElementById('fullscreen-active-video') as HTMLVideoElement;
                        if (vid) {
                          vid.muted = !vid.muted;
                          setIsMuted(vid.muted);
                        }
                      }}
                      className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-neutral-400" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
                    </button>

                    <span className="text-xs font-mono text-neutral-400">
                      {Math.floor(currentTime)}s / {Math.floor(duration || 30)}s
                    </span>
                  </div>

                  <div className="text-right">
                    <h4 className="text-sm sm:text-base font-light tracking-wider uppercase text-white">
                      {activeVideo.title}
                    </h4>
                    <p className="text-xs serif italic text-neutral-300 hidden sm:block">
                      &ldquo;{activeVideo.caption}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
