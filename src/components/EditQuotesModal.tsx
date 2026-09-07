import React, { useState, useEffect } from 'react';
import { RememberedQuote, Friend } from '../types';
import { X, Plus, Trash2, Quote, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface EditQuotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotes: RememberedQuote[];
  friends: Friend[];
  onSaveQuotes: (quotes: RememberedQuote[]) => void;
}

export const EditQuotesModal: React.FC<EditQuotesModalProps> = ({
  isOpen,
  onClose,
  quotes,
  friends,
  onSaveQuotes
}) => {
  const [quoteList, setQuoteList] = useState<RememberedQuote[]>(quotes);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>(quotes[0]?.id || '');

  useEffect(() => {
    if (quotes && quotes.length > 0) {
      setQuoteList(JSON.parse(JSON.stringify(quotes)));
      if (!selectedQuoteId || !quotes.some((q) => q.id === selectedQuoteId)) {
        setSelectedQuoteId(quotes[0].id);
      }
    }
  }, [quotes, isOpen]);

  if (!isOpen) return null;

  const currentQuote = quoteList.find((q) => q.id === selectedQuoteId) || quoteList[0];

  const updateCurrentQuote = (updates: Partial<RememberedQuote>) => {
    if (!currentQuote) return;
    setQuoteList((prev) =>
      prev.map((q) => (q.id === currentQuote.id ? { ...q, ...updates } : q))
    );
  };

  const handleAddNewQuote = () => {
    const newId = `q-${Date.now()}`;
    const newQuote: RememberedQuote = {
      id: newId,
      quote: '“New unforgettable line someone yelled in the car.”',
      author: friends[0]?.name || 'Friend',
      context: 'Said while laughing uncontrollably at 2 AM.',
      timestamp: '18 AUG • 1:30 AM',
      tag: 'Classic'
    };
    setQuoteList([...quoteList, newQuote]);
    setSelectedQuoteId(newId);
  };

  const handleDeleteQuote = (id: string) => {
    if (quoteList.length <= 1) {
      alert('You must keep at least one quote.');
      return;
    }
    const remaining = quoteList.filter((q) => q.id !== id);
    setQuoteList(remaining);
    setSelectedQuoteId(remaining[0].id);
  };

  const handleSave = () => {
    onSaveQuotes(quoteList);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl">
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative z-10 w-full max-w-2xl glass p-6 sm:p-8 border border-white/15 shadow-2xl bg-neutral-950/95 max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-6">
          <div>
            <p className="text-[10px] tracking-super-wide opacity-40 uppercase font-mono mb-1">
              EDIT SECTION &bull; WORDS WE REMEMBER
            </p>
            <h3 className="text-xl sm:text-2xl font-light text-white tracking-wider uppercase">
              EDIT QUOTES &amp; ONE-LINERS
            </h3>
            <p className="text-xs text-neutral-400 font-sans mt-1">
              Quotes, midnight confessions, and inside jokes whispered in the front seat.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 glass text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab list */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-white/10">
          {quoteList.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setSelectedQuoteId(q.id)}
              className={`px-3.5 py-2 text-[10px] font-mono uppercase tracking-widest flex-shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                currentQuote?.id === q.id
                  ? 'bg-white text-black font-semibold'
                  : 'glass text-neutral-400 hover:text-white'
              }`}
            >
              <Quote className="w-3 h-3" />
              <span>{q.author}: Quote {idx + 1}</span>
            </button>
          ))}

          <button
            onClick={handleAddNewQuote}
            className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest flex-shrink-0 border border-dashed border-white/30 hover:border-white text-amber-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3 h-3" />
            <span>Add Quote</span>
          </button>
        </div>

        {currentQuote && (
          <div className="space-y-6">
            {/* Quote text */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                EXACT QUOTE TEXT
              </label>
              <textarea
                rows={3}
                value={currentQuote.quote}
                onChange={(e) => updateCurrentQuote({ quote: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white serif italic text-base leading-relaxed"
                placeholder="“Type the unforgettable line here…”"
              />
            </div>

            {/* Author & Tag */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                  WHO SAID IT (AUTHOR)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentQuote.author}
                    onChange={(e) => updateCurrentQuote({ author: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 bg-black/50 border border-white/15 text-white text-sm"
                  />
                  {friends.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => updateCurrentQuote({ author: f.name })}
                      className="px-2.5 py-1 glass text-[10px] font-mono text-neutral-300 hover:text-white hover:border-white/40 cursor-pointer"
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                  CATEGORY TAG (E.G. CLASSIC, FAMOUS LAST WORDS)
                </label>
                <input
                  type="text"
                  value={currentQuote.tag}
                  onChange={(e) => updateCurrentQuote({ tag: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white font-mono text-xs uppercase"
                />
              </div>
            </div>

            {/* Context Backstory */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                CONTEXT / WHAT WAS HAPPENING
              </label>
              <textarea
                rows={2}
                value={currentQuote.context}
                onChange={(e) => updateCurrentQuote({ context: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white text-xs leading-relaxed resize-none"
                placeholder="Where were you and why did they say this?"
              />
            </div>

            {/* Timestamp */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                DATE &amp; TIME (E.G. 08 JUL • 7:15 PM)
              </label>
              <input
                type="text"
                value={currentQuote.timestamp}
                onChange={(e) => updateCurrentQuote({ timestamp: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 text-white font-mono text-xs"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDeleteQuote(currentQuote.id)}
                className="text-[10px] font-mono uppercase text-red-400 hover:text-red-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Quote</span>
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
                  Save Quotes
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
