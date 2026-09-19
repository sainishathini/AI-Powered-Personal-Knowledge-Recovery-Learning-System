import React from 'react';
import { X, FileText, Bookmark, Layers, Link as LinkIcon, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ConceptDrawer({ concept, onClose }) {
  if (!concept) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-end">
      <div className="glass-panel w-full max-w-lg h-full border-l border-indigo-500/40 p-6 sm:p-8 space-y-6 overflow-y-auto flex flex-col justify-between animate-slide-left">
        
        <div className="space-y-6">
          
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                {concept.category || 'Core Concept'}
              </span>
              <h2 className="text-2xl font-bold text-white font-sans">{concept.conceptTitle || concept.title || concept.label}</h2>
            </div>
            
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Source attribution pill */}
          <div className="bg-slate-900/90 border border-indigo-500/30 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Source Material</div>
              <div className="text-xs font-bold text-white">{concept.sourceDocTitle}</div>
              <div className="text-[11px] text-indigo-300 font-medium">{concept.location || 'Page 1'}</div>
            </div>
          </div>

          {/* Definition */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Definition</h4>
            <p className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              {concept.definition}
            </p>
          </div>

          {/* Direct Snippet */}
          {concept.snippet && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Direct Excerpt</h4>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono italic leading-relaxed">
                “{concept.snippet}”
              </div>
            </div>
          )}

          {/* Prerequisites & Connected Concepts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Knowledge Network Links</h4>
            
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Prerequisites:
              </span>
              <div className="flex flex-wrap gap-1 pt-1">
                {concept.prerequisites?.map((p, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {p}
                  </span>
                )) || <span className="text-xs text-slate-500">None</span>}
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-purple-400 font-bold flex items-center gap-1">
                <LinkIcon className="w-3.5 h-3.5" /> Connected Graph Nodes:
              </span>
              <div className="flex flex-wrap gap-1 pt-1">
                {concept.connectedConcepts?.map((c, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {c}
                  </span>
                )) || <span className="text-xs text-slate-500">None</span>}
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
