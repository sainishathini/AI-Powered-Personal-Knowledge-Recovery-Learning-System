import React from 'react';
import { Brain, LayoutDashboard, PlusCircle, Search, Network, BookOpen, AlertTriangle, Sparkles, Plus, Database, Cpu, Compass, User } from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  summary, 
  onSwitchWorkspace, 
  onOpenUpload,
  onOpenLogin,
  user,
  healthStatus,
  isDemoMode,
  onToggleDemoMode
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

          {/* Presentation AI Workspace Button */}
          <button
            onClick={() => setActiveTab('presentation_ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shadow-sm ${
              activeTab === 'presentation_ai'
                ? 'bg-purple-600/30 text-purple-200 border-purple-500/50 shadow-purple-500/20'
                : 'bg-purple-600/10 hover:bg-purple-600/20 text-purple-300 border-purple-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Presentation AI</span>
          </button>

          {/* Student Profile Button */}
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-indigo-500/40 text-xs text-slate-200 font-semibold transition-all"
          >
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span>{user ? user.name : 'Student Account'}</span>
          </button>

          {/* Add Knowledge Header Button */}
          <button
            onClick={() => setActiveTab('add_knowledge')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Knowledge</span>
          </button>
        </div>
      </div>
    </header>
  );
}
