import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Presentation, FileCode, Globe, Plus, Search, Calendar, User, Eye, Sparkles } from 'lucide-react';

export default function MaterialsList({ onOpenUpload }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);

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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'PDF': return <FileText className="w-5 h-5 text-red-400" />;
      case 'PPT': return <Presentation className="w-5 h-5 text-orange-400" />;
      case 'Notes': return <FileCode className="w-5 h-5 text-cyan-400" />;
      case 'Web': return <Globe className="w-5 h-5 text-emerald-400" />;
      default: return <BookOpen className="w-5 h-5 text-indigo-400" />;
    }
  };

  const filteredMaterials = materials.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white font-sans">Study Materials Library</h2>
          </div>
          <p className="text-xs text-slate-400">
            Ingested learning materials processed by AI for instant concept recovery.
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
              placeholder="Search materials or courses..."
              className="bg-transparent outline-none w-full placeholder-slate-500"
            />
          </div>

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shrink-0 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Ingest Material</span>
          </button>
        </div>

      </div>

      {/* Materials Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl h-48 animate-pulse bg-slate-900/50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((doc) => (
            <div
              key={doc.id}
              className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between group hover:border-indigo-500/40"
            >
              
              <div className="space-y-3">
                
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    {getTypeIcon(doc.type)}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-indigo-300 border border-indigo-500/20 uppercase">
                    {doc.type}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">{doc.course}</p>
                </div>

              </div>

              <div className="pt-3 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-500" /> {doc.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" /> {doc.dateAdded}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-indigo-600/30 text-slate-200 hover:text-indigo-200 border border-slate-700 hover:border-indigo-500/40 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Document Content</span>
                </button>
              </div>

            </div>
          ))}
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
                  <p className="text-xs text-indigo-300">{selectedDoc.course} • {selectedDoc.pageCount} Pages</p>
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

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
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
