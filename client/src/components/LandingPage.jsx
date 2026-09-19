import React from 'react';
import { Brain, Search, Network, BookOpen, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Layers, Compass, Zap, Lock } from 'lucide-react';

export default function LandingPage({ onExplore }) {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-20 relative border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-black tracking-wider text-white uppercase font-sans">
              MEMORY<span className="text-indigo-400">MAP</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onExplore('dashboard')}
            className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => onExplore('dashboard')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            <span>Explore MemoryMap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center space-y-8 z-10 relative">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold animate-pulse">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>AI-Powered Personal Knowledge Recovery & Learning System</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight font-sans">
          “You remember the concept.<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">
            We find the knowledge.”
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          MemoryMap transforms scattered learning materials into a personal, searchable map of knowledge.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onExplore('dashboard')}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all active:scale-95"
          >
            <span>Explore MemoryMap</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onExplore('search')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-extrabold text-sm border border-slate-700 transition-all"
          >
            <Search className="w-4 h-4 text-indigo-400" />
            <span>View Demo</span>
          </button>
        </div>

        {/* Visual Preview of Knowledge Map (Prompt Section 13 Requirement) */}
        <div className="pt-12">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/40 shadow-2xl shadow-indigo-950/50 max-w-3xl mx-auto space-y-6 text-left relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/10 pb-3">
              <span className="font-bold text-indigo-300 flex items-center gap-2">
                <Network className="w-4 h-4 text-purple-400" /> Live Visual Knowledge Map Preview
              </span>
              <span className="text-[10px] bg-slate-800 px-2.5 py-0.5 rounded text-emerald-400 font-bold border border-emerald-500/30">
                Indexed: 146 Concepts
              </span>
            </div>

            {/* Topology Hierarchy Diagram */}
            <div className="bg-slate-950/90 p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-indigo-900/90 border border-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-500/30">
                  JAVA CORE
                </div>
              </div>
              <div className="text-purple-400 font-bold text-xs">↓</div>
              <div className="px-4 py-2 rounded-xl bg-cyan-950/90 border border-cyan-400 text-cyan-200 text-xs font-bold shadow-lg shadow-cyan-500/30">
                COLLECTIONS FRAMEWORK
              </div>
              <div className="text-purple-400 font-bold text-xs">↙ &nbsp;&nbsp;&nbsp;&nbsp; ↓ &nbsp;&nbsp;&nbsp;&nbsp; ↘</div>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="px-3.5 py-2 rounded-xl bg-purple-950 border border-purple-400 text-purple-200 text-xs font-bold">
                  ARRAYLIST
                </div>
                <div className="px-4 py-2 rounded-xl bg-purple-900 border border-purple-300 text-white text-xs font-extrabold shadow-lg shadow-purple-500/40 scale-105">
                  HASHSET (Page 12)
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-purple-950 border border-purple-400 text-purple-200 text-xs font-bold">
                  HASHMAP
                </div>
              </div>
              <div className="text-purple-400 font-bold text-xs">↓</div>
              <div className="px-3 py-1.5 rounded-lg bg-amber-950 border border-amber-500 text-amber-200 text-xs font-semibold">
                DUPLICATE REMOVAL
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* SECTIONS: THE PROBLEM, THE SOLUTION, HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-6 py-16 space-y-16 border-t border-white/5">
        
        {/* Grid: The Problem & The Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Section 1: The Problem */}
          <div className="glass-panel p-8 rounded-3xl border border-red-500/20 space-y-4 bg-red-950/5">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
              ❌
            </div>
            <h3 className="text-xl font-bold text-white font-sans">The Problem</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Students learn from many sources such as PDFs, PPTs, notes, and web links. Later, they remember a concept but forget <strong>WHERE</strong> they learned it. Searching through many files wastes time and causes fragmented knowledge.
            </p>
          </div>

          {/* Section 2: The Solution */}
          <div className="glass-panel p-8 rounded-3xl border border-emerald-500/20 space-y-4 bg-emerald-950/5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              💡
            </div>
            <h3 className="text-xl font-bold text-white font-sans">The Solution</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              MemoryMap creates a single intelligent personal knowledge space from all your learning materials. It automatically extracts concepts, connects relationships, and instantly answers *"Where did I learn this?"*.
            </p>
          </div>

        </div>

        {/* Section 3: How It Works (5 Step Flow) */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-indigo-500/30 space-y-8 text-center">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white font-sans">How It Works</h3>
            <p className="text-xs text-slate-400">A seamless 5-step knowledge processing pipeline</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {[
              { num: '1', title: 'Upload', desc: 'PDFs, PPTs, text notes & web links' },
              { num: '2', title: 'Understand', desc: 'AI extracts concepts & definitions' },
              { num: '3', title: 'Connect', desc: 'Maps prerequisite & topology links' },
              { num: '4', title: 'Recover', desc: 'Instantly search origin citations' },
              { num: '5', title: 'Learn', desc: 'Identify gaps & review flashcards' }
            ].map((step, idx) => (
              <div key={idx} className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-2 text-center">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold mx-auto flex items-center justify-center text-xs">
                  {step.num}
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">{step.title}</h4>
                <p className="text-[11px] text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => onExplore('dashboard')}
            className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30"
          >
            Launch MemoryMap Workspace
          </button>
        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500">
        MemoryMap — AI-Powered Personal Knowledge Recovery & Learning System • Presentation Prototype
      </footer>

    </div>
  );
}
