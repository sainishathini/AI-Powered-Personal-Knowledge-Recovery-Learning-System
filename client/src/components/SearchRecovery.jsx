import React, { useState, useEffect } from 'react';
import { Search, Sparkles, FileText, Bookmark, ArrowRight, ShieldCheck, HelpCircle, Layers, Link as LinkIcon, Compass, CheckCircle2, Network } from 'lucide-react';

export default function SearchRecovery({ onSelectConcept, currentDomain, onNavigate, initialQuery }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const sampleQueries = [
    'Where did I learn about HashSet?',
    'What did I learn about Java Collections?',
    'Show my notes about duplicate removal.',
    'What is related to ArrayList?',
    'What should I learn next about HashMap?'
  ];

  const handleSearch = async (searchQuery) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    setQuery(q);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/search/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    } else {
      handleSearch(sampleQueries[0]);
    }
  }, [initialQuery, currentDomain]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Hero Search Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-indigo-500/20 relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Ask My Knowledge Origin Engine</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
            “Where did I learn this?”
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Type any concept, equation, or topic you remember. MemoryMap searches across all your learning materials (PDFs, PPTs, notes & links) to find the exact origin source.
          </p>

          {/* Search Input Bar */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
            className="flex items-center gap-2 bg-slate-900/90 border border-indigo-500/40 rounded-xl p-2 shadow-xl shadow-indigo-950/50 transition-all focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20"
          >
            <div className="pl-3 text-indigo-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Where did I learn about HashSet?"
              className="flex-1 bg-transparent text-white text-sm outline-none px-2 py-1.5 placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Recover Origin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Search Chips */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> Presentation Flow Demo Query:
            </span>
            {sampleQueries.map((qText, idx) => (
              <button
                key={idx}
                onClick={() => { setQuery(qText); handleSearch(qText); }}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-indigo-900/40 text-slate-300 hover:text-indigo-200 border border-slate-700 hover:border-indigo-500/40 transition-all font-semibold"
              >
                {qText}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="glass-panel p-8 rounded-2xl border border-indigo-500/30 space-y-4 animate-pulse">
          <div className="h-6 bg-slate-800 rounded w-1/3" />
          <div className="h-20 bg-slate-800/50 rounded-xl" />
          <div className="h-4 bg-slate-800 rounded w-2/3" />
        </div>
      )}

      {/* Results View */}
      {result && result.primaryResult && !loading && (
        <div className="space-y-6">

          {/* AI Origin Synthesis Banner */}
          <div className="glass-panel p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">AI Recovery Synthesis</h4>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {result.aiInsight}
                </p>
              </div>
            </div>

            {/* Step 4 Action Button: View Knowledge Map */}
            <button
              onClick={() => onNavigate && onNavigate('graph')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shrink-0"
            >
              <Network className="w-4 h-4 text-cyan-300" />
              <span>View Knowledge Map</span>
            </button>
          </div>

          {/* Primary Source Attribution Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-indigo-500/40 space-y-6 relative">
            
            {/* Header / Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full uppercase">
                    {result.primaryResult.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {Math.round(result.primaryResult.confidence * 100)}% Confidence Match
                  </span>
                </div>
                
                <h3 
                  onClick={() => onSelectConcept && onSelectConcept(result.primaryResult)}
                  className="text-xl sm:text-2xl font-bold text-white hover:text-indigo-300 cursor-pointer transition-colors"
                >
                  {result.primaryResult.conceptTitle}
                </h3>
              </div>

              {/* Source Document Badge (Step 3: Found in Java Collections.pdf — Page 12) */}
              <div className="bg-slate-900/90 border border-indigo-500/30 rounded-xl p-3 flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Original Source File</div>
                  <div className="text-xs font-bold text-white truncate max-w-[200px]" title={result.primaryResult.sourceDocTitle}>
                    {result.primaryResult.sourceDocTitle}
                  </div>
                  <div className="text-[11px] text-indigo-400 font-bold flex items-center gap-1">
                    <Bookmark className="w-3 h-3" /> {result.primaryResult.location}
                  </div>
                </div>
              </div>

            </div>

            {/* Definition Box */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Concept Definition</h4>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {result.primaryResult.definition}
              </p>
            </div>

            {/* Direct Excerpt Snippet */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500" />
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold flex items-center gap-1.5 text-indigo-300">
                  <FileText className="w-3.5 h-3.5" /> Direct Excerpt from {result.primaryResult.sourceDocTitle}
                </span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300">
                  {result.primaryResult.location}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono leading-relaxed italic bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                “{result.primaryResult.snippet}”
              </p>
            </div>

            {/* Connections & Prerequisites Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              {/* Prerequisites */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" /> Prerequisite Knowledge
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.primaryResult.prerequisites?.map((prereq, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                      {prereq}
                    </span>
                  )) || <span className="text-xs text-slate-500">None identified</span>}
                </div>
              </div>

              {/* Connected Concepts */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-purple-400" /> Connected Knowledge Map Nodes
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.primaryResult.connectedConcepts?.map((conn, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                      {conn}
                    </span>
                  )) || <span className="text-xs text-slate-500">None identified</span>}
                </div>
              </div>

            </div>

          </div>

          {/* Secondary Matches */}
          {result.secondaryResults && result.secondaryResults.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Secondary Related Source References</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.secondaryResults.map((sec, idx) => (
                  <div key={idx} className="glass-card p-4 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{sec.conceptTitle}</span>
                      <span className="text-[10px] text-indigo-400">{sec.location}</span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{sec.sourceDocTitle}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
