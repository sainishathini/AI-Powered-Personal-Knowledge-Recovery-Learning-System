import React from 'react';
import { BookOpen, Brain, Network, AlertTriangle, Search, Plus, Sparkles, Clock, ArrowRight, FileText, CheckCircle2, ChevronRight, Compass, RotateCcw } from 'lucide-react';

export default function Dashboard({ summary, onNavigate, onOpenUpload, onOpenDrive, onOpenVideoNotes, onLoadDemoResources }) {
  const stats = summary?.stats || {};
  
  // Real user knowledge metrics derived directly from stored workspace state
  const displayMaterials = stats.totalMaterials !== undefined ? stats.totalMaterials : (summary?.recentMaterials?.length || 0);
  const displayConcepts = stats.totalConcepts !== undefined ? stats.totalConcepts : 0;
  const displayConnections = stats.totalRelationships !== undefined ? stats.totalRelationships : 0;
  const displayGaps = stats.criticalGapsCount !== undefined ? stats.criticalGapsCount : 0;

  const recentMaterials = summary?.recentMaterials && summary.recentMaterials.length > 0
    ? summary.recentMaterials
    : [
        { id: 'd1', title: 'Java Collections.pdf', type: 'PDF', course: 'CS201 - Data Structures', dateAdded: 'Today' }
      ];

  const recentSearches = summary?.recentSearches || [
    { query: 'Where did I learn about Vanishing Gradients?', timestamp: '12 mins ago', match: 'Deep_Learning_Lecture_04_Optimization.pdf', confidence: '98%' }
  ];

  const suggestedTopics = summary?.suggestedTopics || [
    { title: 'Hashing & Collision Handling', category: 'Java Collections', reason: 'Feature E Learning Gap (75% Progress)', action: 'Learn Next' }
  ];

  const recentRecoveredMemory = summary?.recentRecoveredMemory || [
    { concept: 'HashSet', recoveredFrom: 'Java Collections.pdf', timestamp: '10 mins ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Section 17: ADD KNOWLEDGE 3-Card Layout */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-white font-sans uppercase tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            ADD KNOWLEDGE SOURCES
          </h2>
          <span className="text-xs text-slate-400">Supported: Drive, File Uploads, Video Lectures & Notes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: 🔗 Connect Google Drive */}
          <div className="glass-panel p-5 rounded-2xl border border-indigo-500/40 bg-gradient-to-b from-indigo-950/40 to-slate-900/90 space-y-3 hover:border-indigo-400 transition-all flex flex-col justify-between group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center text-lg font-bold group-hover:scale-105 transition-transform">
                🔗
              </div>
              <h3 className="text-base font-bold text-white font-sans">Connect Google Drive</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Access your selected learning folder and continuously sync its contents.
              </p>
            </div>

            <button
              onClick={onOpenDrive}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>🔗 Connect Drive</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: 📤 Upload Resources */}
          <div className="glass-panel p-5 rounded-2xl border border-cyan-500/40 bg-gradient-to-b from-cyan-950/40 to-slate-900/90 space-y-3 hover:border-cyan-400 transition-all flex flex-col justify-between group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-lg font-bold group-hover:scale-105 transition-transform">
                📤
              </div>
              <h3 className="text-base font-bold text-white font-sans">Upload Resources</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload PDFs, PPTs, DOCs, handwritten notes, or images directly from your computer.
              </p>
            </div>

            <button
              onClick={() => onOpenUpload && onOpenUpload('file')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Upload Files</span>
            </button>
          </div>

          {/* Card 3: 🎥 Quick Video Notes */}
          <div className="glass-panel p-5 rounded-2xl border border-purple-500/40 bg-gradient-to-b from-purple-950/40 to-slate-900/90 space-y-3 hover:border-purple-400 transition-all flex flex-col justify-between group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40 flex items-center justify-center text-lg font-bold group-hover:scale-105 transition-transform">
                🎥
              </div>
              <h3 className="text-base font-bold text-white font-sans">Quick Video Notes</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Turn a YouTube lecture into notes, concepts and knowledge.
              </p>
            </div>

            <button
              onClick={() => onOpenVideoNotes ? onOpenVideoNotes() : (onOpenUpload && onOpenUpload('video_notes'))}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Add Video</span>
            </button>
          </div>

        </div>

        {/* Section 19 Requirement: Presentation AI Dashboard Card */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/40 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40 flex items-center justify-center text-lg font-bold">
              🪄
            </div>
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                PRESENTATION AI <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">PPTX Generator</span>
              </h3>
              <p className="text-xs text-slate-300">
                Turn your Google Drive files, PDFs, PPTs, notes, and YouTube lectures directly into a ready-to-present PowerPoint presentation.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('presentation_ai')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
          >
            <span>Create Presentation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
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
