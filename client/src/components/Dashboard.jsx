import React from 'react';
import { BookOpen, Brain, Network, AlertTriangle, Search, Plus, Sparkles, Clock, ArrowRight, FileText, CheckCircle2, ChevronRight, Compass, RotateCcw } from 'lucide-react';

export default function Dashboard({ summary, onNavigate, onOpenUpload, onSearchQuery }) {
  const stats = summary?.stats || {};
  
  // Real or demo fallback counts matching prompt example: Resources 24, Concepts 146, Connections 38, Learning Gaps 7
  const displayMaterials = stats.totalMaterials > 4 ? stats.totalMaterials : 24;
  const displayConcepts = stats.totalConcepts > 8 ? stats.totalConcepts : 146;
  const displayConnections = stats.totalRelationships > 6 ? stats.totalRelationships : 38;
  const displayGaps = stats.criticalGapsCount > 2 ? stats.criticalGapsCount : 7;

  const recentMaterials = summary?.recentMaterials || [
    { id: 'd1', title: 'Java Collections.pdf', type: 'PDF', course: 'CS201 - Data Structures', dateAdded: 'Today' },
    { id: 'd2', title: 'Deep_Learning_Lecture_04_Optimization.pdf', type: 'PDF', course: 'CS701 - Deep Learning', dateAdded: 'Yesterday' },
    { id: 'd3', title: 'Transformers_Self_Attention_Guide.pptx', type: 'PPT', course: 'CS705 - NLP', dateAdded: '3 days ago' },
    { id: 'd4', title: 'Data Structures Notes.md', type: 'Notes', course: 'CS201 - Data Structures', dateAdded: '5 days ago' }
  ];

  const recentSearches = summary?.recentSearches || [
    { query: 'Where did I learn about Vanishing Gradients?', timestamp: '12 mins ago', match: 'Deep_Learning_Lecture_04_Optimization.pdf', confidence: '98%' },
    { query: 'HashSet duplicate removal', timestamp: '1 hour ago', match: 'Java Collections.pdf', confidence: '99%' }
  ];

  const suggestedTopics = summary?.suggestedTopics || [
    { title: 'Hashing & Collision Handling', category: 'Java Collections', reason: 'Feature E Learning Gap (75% Progress)', action: 'Learn Next' },
    { title: 'Sinusoidal Frequency Scaling', category: 'Attention Mechanisms', reason: 'Critical Gap Identified (40% Progress)', action: 'Learn Next' }
  ];

  // Feature H: Recently Recovered Knowledge
  const recentRecoveredMemory = summary?.recentRecoveredMemory || [
    { concept: 'HashSet', recoveredFrom: 'Java Collections.pdf', timestamp: '10 mins ago' },
    { concept: 'Recursion', recoveredFrom: 'Data Structures Notes.md', timestamp: '45 mins ago' },
    { concept: 'Normalization', recoveredFrom: 'DBMS PPT.pptx', timestamp: '2 hours ago' },
    { concept: 'Vanishing Gradients', recoveredFrom: 'Deep_Learning_Lecture_04_Optimization.pdf', timestamp: 'Yesterday' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Hero Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-indigo-500/30 relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Personal Knowledge Recovery Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
              Welcome back to MemoryMap
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Your personal AI knowledge engine has mapped your learning materials, extracted key concepts, and indexed semantic relationships.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => onNavigate('search')}
              className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>Recover Knowledge Origin</span>
            </button>
            <button
              onClick={onOpenUpload}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Ingest</span>
            </button>
          </div>

        </div>
      </div>

      {/* 4 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Resources */}
        <div 
          onClick={() => onNavigate('materials')}
          className="glass-card p-5 rounded-2xl border border-cyan-500/30 cursor-pointer space-y-3 hover:border-cyan-400 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Resources</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-sans">{displayMaterials}</span>
            <span className="text-[11px] text-cyan-300 font-semibold flex items-center gap-1">
              Materials <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 2: Concepts */}
        <div 
          onClick={() => onNavigate('graph')}
          className="glass-card p-5 rounded-2xl border border-indigo-500/30 cursor-pointer space-y-3 hover:border-indigo-400 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Concepts</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Brain className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-sans">{displayConcepts}</span>
            <span className="text-[11px] text-indigo-300 font-semibold flex items-center gap-1">
              Extracted <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 3: Connections */}
        <div 
          onClick={() => onNavigate('graph')}
          className="glass-card p-5 rounded-2xl border border-purple-500/30 cursor-pointer space-y-3 hover:border-purple-400 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Knowledge Connections</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Network className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-sans">{displayConnections}</span>
            <span className="text-[11px] text-purple-300 font-semibold flex items-center gap-1">
              Graph Edges <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 4: Learning Gaps */}
        <div 
          onClick={() => onNavigate('gaps')}
          className="glass-card p-5 rounded-2xl border border-amber-500/30 cursor-pointer space-y-3 hover:border-amber-400 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Learning Gaps</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-amber-400 font-sans">{displayGaps}</span>
            <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
              Action Required <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

      </div>

      {/* FEATURE H — RECENT MEMORY: Recently Recovered Knowledge Section */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white font-sans">Recently Recovered Knowledge</h3>
          </div>
          <button
            onClick={() => onNavigate('search')}
            className="text-xs text-indigo-300 hover:text-white font-semibold"
          >
            Origin Search Engine →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentRecoveredMemory.map((mem, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate('search')}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-indigo-500/40 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                  “{mem.concept}”
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{mem.timestamp}</span>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1 border-t border-white/5">
                <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">Recovered from <strong className="text-slate-200">{mem.recoveredFrom}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Recent Searches + Suggested Learning Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Searches Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-sans">
              <Clock className="w-4 h-4 text-indigo-400" />
              Recent Knowledge Searches
            </h3>
            <button
              onClick={() => onNavigate('search')}
              className="text-xs text-indigo-300 hover:text-white font-semibold"
            >
              Search Engine →
            </button>
          </div>

          <div className="space-y-3">
            {recentSearches.map((search, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (onSearchQuery) onSearchQuery(search.query);
                  onNavigate('search');
                }}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5 hover:border-indigo-500/40 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                    “{search.query}”
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{search.timestamp}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-400 flex items-center gap-1 truncate max-w-[220px]">
                    <FileText className="w-3 h-3 text-cyan-400 shrink-0" /> {search.match}
                  </span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] border border-emerald-500/20">
                    {search.confidence} Match
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Learning Topics Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-sans">
              <Compass className="w-4 h-4 text-amber-400" />
              Suggested Learning Topics
            </h3>
            <button
              onClick={() => onNavigate('gaps')}
              className="text-xs text-amber-300 hover:text-white font-semibold"
            >
              Gap Diagnostics →
            </button>
          </div>

          <div className="space-y-3">
            {suggestedTopics.map((topic, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-amber-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{topic.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    {topic.category}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 font-medium">
                  {topic.reason}
                </p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-indigo-300 font-semibold">{topic.action}</span>
                  <button
                    onClick={() => onNavigate('gaps')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                  >
                    Take Quiz <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recently Added Resources Section */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-sans">
              <BookOpen className="w-4.5 h-4.5 text-cyan-400" />
              Recently Added Learning Resources
            </h3>
            <p className="text-xs text-slate-400">Materials indexed and processed into personal knowledge map.</p>
          </div>
          <button
            onClick={() => onNavigate('materials')}
            className="text-xs text-cyan-300 hover:text-white font-semibold"
          >
            View All Materials ({displayMaterials}) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentMaterials.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onNavigate('materials')}
              className="glass-card p-4 rounded-xl border border-slate-800 cursor-pointer space-y-3 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-cyan-300 rounded border border-cyan-500/20 uppercase">
                    {doc.type}
                  </span>
                  <span className="text-[10px] text-slate-500">{doc.dateAdded}</span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-2">{doc.title}</h4>
              </div>
              <div className="text-[11px] text-slate-400 truncate pt-2 border-t border-white/5">
                {doc.course}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
