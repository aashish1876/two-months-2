import React, { useState } from 'react';
import { RememberedQuote } from '../types';
import { REMEMBERED_QUOTES as DEFAULT_QUOTES } from '../data/memoriesData';
import { Quote, Sparkles, Check, Copy } from 'lucide-react';
import { motion } from 'motion/react';

interface WordsWeRememberProps {
  quotes?: RememberedQuote[];
}

export const WordsWeRemember: React.FC<WordsWeRememberProps> = ({
  quotes = DEFAULT_QUOTES,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (id: string, text: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch {
      // Gracefully ignore clipboard restrictions in sandboxed iframes
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Ambience */}
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <p className="text-[10px] tracking-super-wide opacity-40 uppercase font-mono mb-4">
          SPOKEN IN PASSING &bull; REMEMBERED FOREVER
        </p>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light text-[#F5F5F5] tracking-tight">
          WORDS WE REMEMBER
        </h2>
        <p className="mt-4 text-xs sm:text-sm tracking-widest uppercase opacity-60 font-sans max-w-md mx-auto">
          Spoken from passenger seats, across diner tables at 3 AM, and around fading fires.
        </p>
      </div>

      {/* Floating Translucent Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {quotes.map((item, index) => {
          const isCopied = copiedId === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass p-8 relative overflow-hidden border border-white/10 flex flex-col justify-between group hover:border-white/20 transition-all duration-500"
            >
              {/* Decorative Watermark Serif Quote */}
              <div className="absolute top-0 right-0 p-4 opacity-10 italic serif text-4xl pointer-events-none">
                "
              </div>

              <div>
                {/* Tag & Timestamp */}
                <div className="flex items-center justify-between text-[9px] font-mono tracking-widest opacity-50 uppercase mb-5">
                  <span className="px-2 py-0.5 border border-white/10 bg-white/5">
                    {item.tag}
                  </span>
                  <span>{item.timestamp}</span>
                </div>

                {/* Main Quote */}
                <p className="serif text-lg sm:text-xl italic leading-relaxed opacity-90 mb-4 pr-2">
                  “{item.quote}”
                </p>

                {/* Conversational Context */}
                <p className="mt-3 text-xs sm:text-sm text-neutral-400 font-light leading-relaxed font-sans">
                  {item.context}
                </p>
              </div>

              {/* Speaker Attribution & Copy Action */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="text-[10px] tracking-widest font-mono opacity-75 uppercase">
                  &mdash; {item.author.toUpperCase()}
                </div>

                <button
                  onClick={() => handleCopy(item.id, `${item.quote} — ${item.author}`)}
                  title="Copy quote"
                  className="opacity-50 hover:opacity-100 p-1.5 transition-all text-xs flex items-center gap-1 font-mono cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span className="text-[9px] tracking-widest uppercase">COPIED</span>
                    </>
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-neutral-300" />
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
