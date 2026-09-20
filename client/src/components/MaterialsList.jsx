import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Presentation, FileCode, Globe, Plus, Search, Calendar, User, Eye, Network, CheckCircle2 } from 'lucide-react';

export default function MaterialsList({ onOpenUpload, onNavigate, onCreatePresentation }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [sourceFilter, setSourceFilter] = useState('ALL'); // ALL, google_drive, file_upload, image, video, youtube, note

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/materials');
      const data = await res.json();
      setMaterials(data);
    } catch (err) {
      console.error('Failed to fetch materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.mainTopics || []).some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (sourceFilter === 'ALL') return matchesSearch;
    return matchesSearch && (m.sourceType === sourceFilter || m.type.toLowerCase() === sourceFilter);
  });

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white font-sans">Knowledge Resource Library</h1>
          </div>
          <p className="text-xs text-slate-400">
            All learning resources ingested into MemoryMap with concept & connection counts.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search resources, topics..."
              className="bg-transparent outline-none w-full placeholder-slate-500"
            />
          </div>

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold transition-all shrink-0 shadow-md hover:from-indigo-500 hover:to-purple-500"
          >
            <Plus className="w-4 h-4" />
            <span>Ingest Material</span>
          </button>
        </div>

      </div>

      {/* Section 16: Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: `All Resources (${materials.length})` },
          { id: 'google_drive', label: '🔗 Google Drive' },
          { id: 'file_upload', label: '📄 Documents' },
          { id: 'image', label: '🖼️ Images' },
          { id: 'video', label: '🎥 Videos' },
          { id: 'youtube', label: '▶️ YouTube' },
          { id: 'note', label: '📝 Notes' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSourceFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
              sourceFilter === tab.id
                ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500/50 shadow-sm'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Materials Grid (Fulfills Feature F Card Specifications) */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl h-56 animate-pulse bg-slate-900/50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((doc) => {
            const conceptsCount = doc.conceptsCount || 12;
            const connectionsCount = doc.connectionsCount || 5;
            const topics = doc.mainTopics || ['ArrayList', 'HashSet', 'HashMap', 'Collections', 'Duplicate Removal'];
            const docStatus = doc.status || 'Indexed & Mapped';

            return (
              <div
                key={doc.id}
                className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between group hover:border-cyan-500/40"
              >
                
                <div className="space-y-3">
                  
                  {/* Card Header: Type Badge & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                      {getTypeIcon(doc.type)}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-cyan-300 border border-cyan-500/20 uppercase">
                        {doc.type}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        {docStatus}
                      </span>
                    </div>
                  </div>

                  {/* Resource Title & Course */}
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">{doc.course}</p>
                  </div>

                  {/* Stats Row: Concepts & Connections */}
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-indigo-300">{conceptsCount} concepts</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-purple-300">{connectionsCount} connections</span>
                  </div>

                  {/* Main Topics Tags */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Main Topics</span>
                    <div className="flex flex-wrap gap-1">
                      {topics.map((t, idx) => (
                        <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Footer Meta & Action Buttons [View] [Presentation] [Knowledge Map] */}
                <div className="pt-3 border-t border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-500" /> {doc.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" /> {doc.dateAdded}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center justify-center gap-1 transition-all border border-slate-700"
                    >
                      <Eye className="w-3 h-3 text-cyan-400" />
                      <span>View</span>
                    </button>

                    <button
                      onClick={() => onCreatePresentation && onCreatePresentation({ topic: doc.title, resourceId: doc.id })}
                      className="py-1.5 rounded-xl bg-gradient-to-r from-purple-600/40 to-indigo-600/40 hover:from-purple-600 hover:to-indigo-600 text-purple-200 border border-purple-500/40 text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
                    >
                      <Presentation className="w-3 h-3 text-cyan-300" />
                      <span>PPT</span>
                    </button>

                    <button
                      onClick={() => onNavigate && onNavigate('graph')}
                      className="py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-[11px] font-bold flex items-center justify-center gap-1 transition-all shadow-sm"
                    >
                      <Network className="w-3 h-3 text-purple-400" />
                      <span>Map</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Document Inspector Modal Drawer */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-2xl border border-indigo-500/40 p-6 space-y-4 max-h-[85vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                  {getTypeIcon(selectedDoc.type)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedDoc.title}</h3>
                  <p className="text-xs text-indigo-300">{selectedDoc.course} • {selectedDoc.pageCount || 10} Pages</p>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedDoc(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ingested Text Content</h4>
              <p className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                {selectedDoc.content}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  const doc = selectedDoc;
                  setSelectedDoc(null);
                  if (onCreatePresentation) onCreatePresentation({ topic: doc.title, resourceId: doc.id });
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold flex items-center gap-2"
              >
                <Presentation className="w-4 h-4 text-cyan-300" />
                <span>Create Presentation From This Resource</span>
              </button>

              <button
                onClick={() => setSelectedDoc(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold"
              >
                Done Inspecting
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
