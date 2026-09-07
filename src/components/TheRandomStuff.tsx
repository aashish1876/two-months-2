import React from 'react';
import { RandomSnippet } from '../types';
import { RANDOM_SNIPPETS as DEFAULT_SNIPPETS } from '../data/memoriesData';
import { MessageSquare, Receipt, Camera, Sparkles, Smile, Flame } from 'lucide-react';
import { motion } from 'motion/react';

interface TheRandomStuffProps {
  snippets?: RandomSnippet[];
}

export const TheRandomStuff: React.FC<TheRandomStuffProps> = ({
  snippets = DEFAULT_SNIPPETS,
}) => {
  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Playful subtle background accent */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <p className="text-[10px] tracking-super-wide opacity-40 uppercase font-mono mb-4">
          UNPLANNED ARTIFACTS &bull; SCRAPBOOK
        </p>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light text-[#F5F5F5] tracking-tight">
          NONE OF THIS WAS PLANNED.
        </h2>
        <p className="mt-4 text-xs sm:text-sm tracking-widest uppercase opacity-60 font-sans max-w-md mx-auto">
          And that’s probably why we remember it.
        </p>
      </div>

      {/* Scrapbook Grid of Random Chaos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {snippets.map((item, index) => {
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              className="group glass p-6 border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between shadow-xl"
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between text-[9px] font-mono opacity-50 uppercase tracking-widest mb-4 pb-2 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    {item.type === 'chat' && <MessageSquare className="w-3 h-3" />}
                    {item.type === 'receipt' && <Receipt className="w-3 h-3" />}
                    {item.type === 'polaroid' && <Camera className="w-3 h-3" />}
                    <span>{item.type.toUpperCase()}</span>
                  </div>
                  <span>{item.date}</span>
                </div>

                <h3 className="text-sm font-light text-white tracking-wider uppercase mb-2">
                  {item.title}
                </h3>

                {item.subtitle && (
                  <p className="text-[10px] font-mono opacity-40 uppercase tracking-widest mb-3">
                    {item.subtitle}
                  </p>
                )}

                {/* Content type specific rendering */}
                {item.type === 'chat' ? (
                  <div className="space-y-2 font-mono text-[11px] text-neutral-300 bg-black/50 p-3.5 border border-white/10 whitespace-pre-line leading-relaxed">
                    {item.content}
                  </div>
                ) : item.type === 'receipt' ? (
                  <div className="font-mono text-[10px] text-neutral-300 bg-neutral-950/70 p-3.5 border border-dashed border-white/20 whitespace-pre-line leading-relaxed">
                    {item.content}
                  </div>
                ) : item.type === 'polaroid' && item.imageUrl ? (
                  <div
                    className="overflow-hidden border border-white/20 bg-neutral-900 p-2 text-white"
                  >
                    <div className="aspect-square w-full overflow-hidden bg-neutral-950 mb-2 border border-white/10">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                    <p className="text-[10px] font-sans opacity-70 italic text-center">
                      {item.content}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs serif italic opacity-85 leading-relaxed">
                    “{item.content}”
                  </p>
                )}
              </div>

              {/* Metadata footer */}
              {item.metadata && (
                <div className="mt-4 pt-3 border-t border-white/10 text-[9px] font-mono opacity-40 uppercase tracking-widest text-right">
                  {item.metadata}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
