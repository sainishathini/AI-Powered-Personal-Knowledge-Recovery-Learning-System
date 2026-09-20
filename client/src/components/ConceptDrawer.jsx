import React, { useState } from 'react';
import { X, FileText, Bookmark, Layers, Link as LinkIcon, Sparkles, ExternalLink, HelpCircle, Presentation, Play, Video, Eye } from 'lucide-react';

export default function ConceptDrawer({ concept, onClose, onNavigate, onCreatePresentation }) {
  const [activeSourceModal, setActiveSourceModal] = useState(null);

  if (!concept) return null;

  const conceptName = concept.conceptTitle || concept.title || concept.label || 'Concept Details';
  const category = concept.category || 'Core Concept';
  const definition = concept.definition || concept.snippet || 'Key concept extracted and indexed in MemoryMap knowledge base.';
  const mastery = concept.mastery || 85;

  // Build dynamic resources list from concept metadata
  const resourcesList = Array.isArray(concept.resourcesList) && concept.resourcesList.length > 0 
    ? concept.resourcesList 
    : [
        {
          id: concept.sourceDocId || 'res-default-1',
          title: concept.sourceDocTitle || 'Ingested Learning Resource',
          sourceType: concept.sourceType || (concept.sourceDocTitle && concept.sourceDocTitle.endsWith('.mp4') ? 'video' : concept.sourceDocTitle && concept.sourceDocTitle.includes('YouTube') ? 'youtube' : 'file_upload'),
          location: concept.location || 'Section 1',
          sourceUrl: concept.sourceUrl || null,
          content: concept.snippet || concept.definition || 'Full ingested text content available.'
        }
      ];

  const getSourceIcon = (type) => {
    switch (type) {
      case 'video': return '🎥 Uploaded Video';
      case 'youtube': return '▶️ YouTube Lecture';
      case 'google_drive': return '🔗 Google Drive';
      case 'image': return '🖼️ Image / OCR';
      case 'note': return '📝 Study Note';
      default: return '📄 Document File';
    }
  };

  const handleViewSource = (resTarget) => {
    const primaryRes = resTarget || resourcesList[0];
    if (primaryRes && primaryRes.sourceUrl && (primaryRes.sourceUrl.startsWith('http://') || primaryRes.sourceUrl.startsWith('https://'))) {
      window.open(primaryRes.sourceUrl, '_blank');
    } else {
      setActiveSourceModal(primaryRes);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-end">
        <div className="glass-panel w-full max-w-lg h-full border-l border-indigo-500/40 p-6 sm:p-8 space-y-6 overflow-y-auto flex flex-col justify-between animate-slide-left">
          
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                    {category}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {mastery}% Recall Strength
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white font-sans tracking-tight">{conceptName}</h2>
              </div>
              
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Definition Box */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Definition</h4>
              <p className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                {definition}
              </p>
            </div>

            {/* Direct Excerpt Snippet */}
            {concept.snippet && concept.snippet !== definition && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Direct Excerpt / Context</h4>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono italic leading-relaxed">
                  “{concept.snippet}”
                </div>
              </div>
            )}

            {/* Sources Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-cyan-400" /> Source Materials ({resourcesList.length})
              </h4>
              
              <div className="space-y-2">
                {resourcesList.map((res, idx) => (
                  <div key={idx} className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span className="flex items-center gap-1.5 truncate">
                        {res.title}
                      </span>
                      <span className="text-[10px] text-cyan-300 font-mono bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 shrink-0">
                        {res.location || 'Indexed'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-indigo-300 font-medium">
                      <span>Type: {getSourceIcon(res.sourceType)}</span>
                      <button 
                        onClick={() => handleViewSource(res)}
                        className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/30 flex items-center gap-1 transition-all"
                      >
                        <Eye className="w-3 h-3" /> Inspect Source
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Concepts / Network Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Related Concepts & Graph Nodes</h4>
              
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[11px] text-purple-400 font-bold flex items-center gap-1">
                  <LinkIcon className="w-3.5 h-3.5" /> Connected Knowledge Map Nodes:
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {Array.isArray(concept.connectedConcepts) && concept.connectedConcepts.length > 0 ? (
                    concept.connectedConcepts.map((c, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                        {c}
                      </span>
                    ))
                  ) : Array.isArray(concept.related) && concept.related.length > 0 ? (
                    concept.related.map((c, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                        {c}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 font-medium">Core Domain Topic</span>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Action Buttons Footer: [View Source] [Ask About This] [Create Presentation] */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleViewSource(resourcesList[0])}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                <span>View Source</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  if (onNavigate) onNavigate('search');
                }}
                className="py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <HelpCircle className="w-3.5 h-3.5 text-indigo-300" />
                <span>Ask About This</span>
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                if (onCreatePresentation) {
                  onCreatePresentation({ 
                    topic: conceptName,
                    resourceId: concept.sourceDocId || (resourcesList[0] && resourcesList[0].id)
                  });
                }
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Presentation className="w-4 h-4 text-cyan-300" />
              <span>Create Presentation</span>
            </button>

          </div>

        </div>
      </div>

      {/* Dynamic Source Resource Viewer Modal (Replaces browser alert) */}
      {activeSourceModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-2xl border border-cyan-500/40 p-6 space-y-5 max-h-[88vh] flex flex-col shadow-2xl animate-fade-in">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                  {getSourceIcon(activeSourceModal.sourceType)}
                </span>
                <h3 className="text-xl font-bold text-white font-sans tracking-tight">
                  {activeSourceModal.title}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Location: {activeSourceModal.location || 'Indexed Material'}
                </p>
              </div>

              <button
                onClick={() => setActiveSourceModal(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Media Player Simulation for Video / YouTube / Document Viewer */}
            {(activeSourceModal.sourceType === 'video' || (activeSourceModal.title && activeSourceModal.title.endsWith('.mp4'))) ? (
              <div className="space-y-3">
                <div className="w-full bg-slate-950 rounded-xl border border-slate-800 p-6 flex flex-col items-center justify-center space-y-3 relative overflow-hidden group">
                  <div className="w-16 h-16 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 shadow-lg">
                    <Video className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div className="text-center space-y-1">
                    <h5 className="text-sm font-bold text-white">{activeSourceModal.title}</h5>
                    <p className="text-xs text-slate-400 font-mono">Playback Timecode: {activeSourceModal.location || '04:12 / 18:45'}</p>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full w-1/3"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Resource Metadata</div>
                <div className="text-xs text-slate-300">Indexed document material extracted into MemoryMap knowledge structure.</div>
              </div>
            )}

            {/* Extracted Transcript / Content Viewer */}
            <div className="flex-1 overflow-y-auto bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Extracted Transcript & Context Notes</h4>
              <p className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                {activeSourceModal.content || concept.definition || `Full extracted text and concept notes for ${activeSourceModal.title}. Indexed with MemoryMap AI.`}
              </p>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  const title = activeSourceModal.title;
                  const resId = activeSourceModal.id || concept.sourceDocId;
                  setActiveSourceModal(null);
                  onClose();
                  if (onCreatePresentation) onCreatePresentation({ topic: title, resourceId: resId });
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-2 hover:from-purple-500 hover:to-indigo-500 transition-all shadow-md"
              >
                <Presentation className="w-4 h-4 text-cyan-300" />
                <span>Create Presentation From This Source</span>
              </button>

              <button
                onClick={() => setActiveSourceModal(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-all"
              >
                Done Inspecting
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

