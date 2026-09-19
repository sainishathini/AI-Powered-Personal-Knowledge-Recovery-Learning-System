import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCw, ChevronLeft, ChevronRight, CheckCircle2, Bookmark, FileText, Layers, Award } from 'lucide-react';

export default function Flashcards() {
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState([]);

  useEffect(() => {
    fetchConcepts();
  }, []);

  const fetchConcepts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/concepts');
      const data = await res.json();
      setConcepts(data);
    } catch (err) {
      console.error('Failed to fetch flashcards concepts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % concepts.length);
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + concepts.length) % concepts.length);
  };

  const toggleMastered = (id) => {
    if (masteredIds.includes(id)) {
      setMasteredIds(masteredIds.filter(m => m !== id));
    } else {
      setMasteredIds([...masteredIds, id]);
    }
  };

  if (loading || concepts.length === 0) {
    return (
      <div className="glass-panel p-12 text-center text-slate-400 space-y-3 rounded-2xl">
        <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs">Loading Smart Flashcard Engine...</p>
      </div>
    );
  }

  const current = concepts[currentIndex];
  const isMastered = masteredIds.includes(current.id);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      {/* Header bar */}
      <div className="glass-panel p-6 rounded-2xl border border-pink-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-sans">AI Knowledge Revision Flashcards</h2>
            <p className="text-xs text-slate-400">
              Flip card to reveal origin location, definitions, and connected prerequisites.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-pink-300 font-bold bg-pink-500/10 px-3 py-1.5 rounded-lg border border-pink-500/20">
          <Award className="w-4 h-4" />
          <span>{masteredIds.length} / {concepts.length} Mastered</span>
        </div>
      </div>

      {/* Main Interactive Flip Card */}
      <div className="perspective-1000 min-h-[340px]">
        
        <div
          onClick={() => setFlipped(!flipped)}
          className={`w-full min-h-[340px] cursor-pointer transition-all duration-500 glass-panel rounded-3xl border ${
            flipped 
              ? 'border-purple-500/50 bg-slate-900/90 shadow-2xl shadow-purple-950/50' 
              : 'border-indigo-500/40 hover:border-indigo-400 bg-slate-950/80 shadow-2xl shadow-indigo-950/50'
          } p-8 flex flex-col justify-between relative overflow-hidden group`}
        >
          
          {/* Card Top Details */}
          <div className="flex items-center justify-between z-10">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {current.category || 'Core Concept'}
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span>Card {currentIndex + 1} of {concepts.length}</span>
              <RotateCw className="w-3.5 h-3.5 text-pink-400 group-hover:rotate-180 transition-transform duration-500" />
            </div>
          </div>

          {/* Front vs Back Content */}
          <div className="my-6 space-y-4 z-10 text-center sm:text-left">
            {!flipped ? (
              /* FRONT SIDE */
              <div className="space-y-3">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Concept Query</div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
                  {current.title}
                </h3>
                <p className="text-xs text-indigo-300 font-medium pt-2 flex items-center justify-center sm:justify-start gap-1">
                  <Bookmark className="w-3.5 h-3.5" /> Source: {current.sourceDocTitle || 'Lecture Material'}
                </p>
                <div className="pt-4 text-xs text-slate-500 italic">
                  👆 Click card to flip and verify definition & excerpt origin...
                </div>
              </div>
            ) : (
              /* BACK SIDE */
              <div className="space-y-4 text-left">
                <div className="text-[11px] font-semibold text-pink-400 uppercase tracking-widest flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Origin Citation: {current.location || 'Page 1'}
                </div>

                <p className="text-sm text-slate-100 font-medium leading-relaxed">
                  {current.definition}
                </p>

                {current.snippet && (
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono italic">
                    “{current.snippet}”
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card Bottom Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 z-10">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); toggleMastered(current.id); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                isMastered
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isMastered ? 'Mastered!' : 'Mark as Mastered'}</span>
            </button>

            <span className="text-xs text-slate-400 font-mono">
              Recall Score: <strong className="text-indigo-300">{current.mastery || 80}%</strong>
            </span>
          </div>

        </div>

      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between px-4">
        <button
          onClick={handlePrev}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-200 text-xs font-bold transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Concept</span>
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow-md"
        >
          <span>Next Concept</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
