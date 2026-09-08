import React from 'react';
import { ArrowDown } from 'lucide-react';
import { motion } from 'motion/react';
import { HeroConfig } from '../types';

interface HeroSectionProps {
  onEnter: () => void;
  heroConfig: HeroConfig;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onEnter,
  heroConfig,
}) => {
  return (
    <section
      id="home"
      className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden select-none"
    >
      {/* Background cinematic photograph with slow ambient parallax scale */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ scale: 1.05 }}
          whileInView={{ scale: 1.12 }}
          transition={{
            duration: 25,
            ease: 'easeInOut'
          }}
          className="w-full h-full"
        >
          <img
            src={heroConfig.bgImageUrl}
            alt="Three best friends laughing at sunset overlook"
            className="w-full h-full object-cover object-center filter brightness-[0.52] contrast-[1.08] saturate-[1.1]"
            fetchPriority="high"
          />
        </motion.div>
      </div>

      {/* Film grain texture */}
      <div className="absolute inset-0 pointer-events-none film-grain opacity-60 z-10" />

      {/* Luxury Cinematic Vignette & Lighting Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-[#050505]/70 z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,5,0.85)_100%)] z-10" />

      {/* Subtle Atmospheric Light */}
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-white/[0.03] rounded-full blur-[140px] pointer-events-none z-10" />

      {/* Content Container */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Editorial Sub-Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-[10px] sm:text-[11px] tracking-super-wide opacity-50 uppercase font-mono mb-8"
        >
          {heroConfig.eyebrow}
        </motion.div>

        {/* Large Editorial Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.4 }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light leading-[0.9] text-[#F5F5F5] mb-6"
        >
          {heroConfig.title}
          <br />
          <span className="serif italic text-4xl sm:text-6xl md:text-7xl lg:text-8xl opacity-90 block mt-2">
            {heroConfig.subtitle}
          </span>
        </motion.h1>

        {/* Small text underneath */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7 }}
          className="mt-4 text-xs sm:text-sm tracking-widest uppercase opacity-60 max-w-sm mx-auto leading-relaxed font-sans"
        >
          {heroConfig.description}
        </motion.p>

        {/* Glass Editorial Button: "ENTER OUR MEMORIES" */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 1.0 }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            id="enter-memories-btn"
            onClick={onEnter}
            className="glass px-10 py-4 rounded-none hover:bg-white hover:text-black transition-all duration-500 text-[11px] tracking-[0.3em] uppercase text-[#F5F5F5] inline-flex items-center gap-3 cursor-pointer"
          >
            <span>{heroConfig.buttonText}</span>
            <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-1" />
          </button>
        </motion.div>

        {/* Subtle metadata coordinate strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.5, delay: 1.4 }}
          className="mt-16 flex items-center gap-6 text-[10px] tracking-super-wide opacity-40 uppercase font-mono"
        >
          <span>{heroConfig.statBadge}</span>
        </motion.div>
      </div>

      {/* Bottom fade into section */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#050505] to-transparent z-20 pointer-events-none" />
    </section>
  );
};
