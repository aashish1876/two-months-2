import React from 'react';
import { ArrowUp, Sparkles, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { FinalSceneConfig } from '../types';
import { DEFAULT_FINAL_SCENE_CONFIG } from '../data/memoriesData';

interface FinalSceneProps {
  onRestart: () => void;
  config?: FinalSceneConfig;
}

export const FinalScene: React.FC<FinalSceneProps> = ({
  onRestart,
  config = DEFAULT_FINAL_SCENE_CONFIG,
}) => {
  return (
    <section className="relative min-h-screen flex flex-col justify-between items-center text-center overflow-hidden bg-black select-none py-28 px-4 sm:px-6">
      {/* Background Photograph of the Three Friends with deep cinematic vignette and slow atmospheric zoom */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ scale: 1.05 }}
          whileInView={{ scale: 1.15 }}
          viewport={{ once: true }} // Fixed: only animate once
          transition={{ duration: 20, ease: 'easeOut' }}
          className="w-full h-full"
        >
          <img
            src={config.bgImageUrl}
            alt="The three friends in the final golden hour"
            className="w-full h-full object-cover filter brightness-[0.38] contrast-[1.15] saturate-[0.85]"
          />
        </motion.div>
      </div>

      {/* Film Grain */}
      <div className="absolute inset-0 pointer-events-none film-grain opacity-50 z-10" />

      {/* Heavy Cinematic Fade Vignette to black */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/80 z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.95)_100%)] z-10" />

      {/* Top coordinates */}
      <div className="relative z-20 pt-6 flex flex-col items-center gap-3">
        <p className="text-[10px] tracking-super-wide font-mono opacity-40 uppercase">
          {config.eyebrow}
        </p>
      </div>

      {/* Emotional Sequence Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 my-auto space-y-12">
        {/* Step 1 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.4 }}
        >
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-light text-neutral-300 tracking-tight uppercase">
            {config.headline}
          </h2>
        </motion.div>

        {/* Step 2 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.6, delay: 0.8 }}
        >
          <p className="text-2xl sm:text-4xl md:text-5xl serif italic text-[#F5F5F5] leading-tight">
            {config.bigQuote}
          </p>
        </motion.div>

        {/* Step 3 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.8, delay: 1.6 }}
          className="space-y-3 pt-6"
        >
          <p className="text-xs sm:text-sm tracking-widest uppercase opacity-60 font-sans">
            {config.noteLine1}
          </p>
          <p className="text-base sm:text-lg serif italic opacity-80">
            {config.noteLine2}
          </p>
        </motion.div>

        {/* Step 4: Until the next adventure... */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 2.0, delay: 2.4 }}
          className="pt-10"
        >
          <p className="text-xs tracking-super-wide opacity-50 uppercase font-mono">
            {config.closingSignoff}
          </p>
        </motion.div>
      </div>

      {/* Fade to Black & Restart Action */}
      <div className="relative z-20 pb-12 flex flex-col items-center gap-4">
        <button
          onClick={onRestart}
          className="group inline-flex items-center gap-2 px-6 py-3 glass text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
        >
          <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          <span>RETURN TO BEGINNING</span>
        </button>

        <p className="text-[9px] font-mono opacity-30 tracking-widest uppercase">
          PRESERVED IN TIME &bull; TWO MONTHS CAPSULE
        </p>
      </div>
    </section>
  );
};

