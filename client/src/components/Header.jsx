import React from 'react';
import { Brain, LayoutDashboard, Search, Network, BookOpen, AlertTriangle, Sparkles, Plus, Database, Cpu } from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  summary, 
  onSwitchWorkspace, 
  onOpenUpload,
  healthStatus 
}) {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-pulse-glow">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 font-sans tracking-tight">
                MemoryMap
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                AI Knowledge Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 italic font-medium">
              “You remember the concept. We find the knowledge.”
            </p>
          </div>
        </div>

        {/* Workspace Switcher & Status */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0">
          
          {/* Workspace selector */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400 font-medium">Domain:</span>
            <select
              value={summary?.info?.id || 'aiml'}
              onChange={(e) => onSwitchWorkspace(e.target.value)}
              className="bg-transparent text-white font-semibold outline-none cursor-pointer pr-1"
            >
              <option value="aiml" className="bg-slate-900 text-white">AI & Deep Learning</option>
              <option value="cs_systems" className="bg-slate-900 text-white">Computer Systems & OS</option>
            </select>
          </div>

          {/* AI Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>{healthStatus?.mode === 'LIVE_LLM' ? 'Live LLM API' : 'Presentation AI'}</span>
          </div>

          {/* Upload Button */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Ingest Material</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto mt-3.5 pt-2 border-t border-white/5 flex items-center justify-between overflow-x-auto">
        <nav className="flex items-center gap-1 sm:gap-2">

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-cyan-400" />
            <span>Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'search'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Search className="w-4 h-4 text-indigo-400" />
            <span>Knowledge Recovery</span>
          </button>

          <button
            onClick={() => setActiveTab('graph')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'graph'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Network className="w-4 h-4 text-purple-400" />
            <span>Knowledge Map</span>
          </button>

          <button
            onClick={() => setActiveTab('materials')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'materials'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Study Materials</span>
            {summary?.stats?.totalMaterials > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300 font-bold">
                {summary.stats.totalMaterials}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('gaps')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'gaps'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Gap Analysis & Quizzes</span>
            {summary?.stats?.criticalGapsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                {summary.stats.criticalGapsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'flashcards'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>Revision Flashcards</span>
          </button>

        </nav>

        {/* Mastery Overview Badge */}
        <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-white/10 text-xs">
          <span className="text-slate-400">Concept Recall Mastery:</span>
          <div className="flex items-center gap-2">
            <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${summary?.stats?.averageMastery || 75}%` }}
              />
            </div>
            <span className="font-bold text-indigo-300">{summary?.stats?.averageMastery || 75}%</span>
          </div>
        </div>

      </div>
    </header>
  );
}
