import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Layers, Sparkles, CheckCircle2, FileText, ArrowRight, ShieldCheck, Bookmark } from 'lucide-react';

export default function ConceptExplorer({ onNavigate }) {
  const [concepts, setConcepts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('HashSet');
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConcepts();
  }, []);

  const fetchConcepts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/concepts');
      const data = await res.json();
      setConcepts(data);

      // Default select HashSet if present or first element
      const hashSet = data.find(c => c.title.toLowerCase() === 'hashset') || data[0];
      setSelectedConcept(hashSet);
    } catch (err) {
      console.error('Failed to fetch concepts for explorer:', err);
    } finally {
      setLoading(false);
    }
  };

  const sampleConceptChips = ['HashSet', 'HashMap', 'ArrayList', 'Vanishing Gradient Problem', 'Scaled Dot-Product Attention'];

  const filteredConcepts = concepts.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-sans">Concept Explorer</h1>
            <p className="text-xs text-slate-400">
              Search any concept to inspect where you learned it, source citations, and related knowledge nodes.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar & Chips */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center gap-3 bg-slate-900 border border-indigo-500/40 rounded-xl p-2.5 shadow-xl">
          <Search className="w-5 h-5 text-indigo-400 pl-1" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search concept e.g. HashSet, HashMap, ArrayList..."
            className="flex-1 bg-transparent text-white text-sm outline-none px-2 py-1"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
          <span className="font-semibold text-slate-500">Quick explore:</span>
          {sampleConceptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchTerm(chip);
                const found = concepts.find(c => c.title.toLowerCase().includes(chip.toLowerCase()));
                if (found) setSelectedConcept(found);
              }}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-indigo-900/40 text-slate-300 hover:text-indigo-200 border border-slate-700 transition-all"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Concept List (Left) + Detailed Explorer View (Right - Feature G Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Concept Selector List */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-2 max-h-[500px] overflow-y-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Matched Concepts</span>
          {filteredConcepts.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedConcept(c)}
              className={`p-3 rounded-xl border cursor-pointer transition-all space-y-1 ${
                selectedConcept?.id === c.id
                  ? 'bg-indigo-900/80 border-indigo-400 shadow-md shadow-indigo-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{c.title}</span>
                <span className="text-[10px] text-purple-300 font-bold">{c.statusLevel || 'Intermediate'}</span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate">{c.category}</span>
            </div>
          ))}
        </div>

        {/* Concept Explorer Detail View (Feature G Specification) */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-2xl border border-indigo-500/40 space-y-6">
          {selectedConcept ? (
            <div className="space-y-6">
              
              {/* Header Title & Status */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                    {selectedConcept.category}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
                    {selectedConcept.title}
                  </h2>
                </div>

                <div className="bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Learning Status</span>
                  <span className="text-xs font-bold text-emerald-400">
                    {selectedConcept.statusLevel || 'Intermediate'} ({selectedConcept.mastery || 90}% Recall)
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</span>
                <p className="text-sm text-slate-100 font-medium leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  {selectedConcept.definition}
                </p>
              </div>

              {/* "You learned this from:" Section */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-cyan-400" /> You learned this from:
                </span>
                
                <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  {(selectedConcept.learnedFrom || [
                    { doc: selectedConcept.sourceDocTitle || 'Java Collections.pdf', location: selectedConcept.location || 'Page 12' },
                    { doc: 'Java Practice Notes.md', location: 'Section 4' }
                  ]).map((source, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 font-semibold">
                      <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="text-white font-bold">{source.doc}</span>
                      <span className="text-slate-500">—</span>
                      <span className="text-indigo-300 font-mono">{source.location}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Concepts */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-400" /> Related Concepts
                </span>

                <div className="flex flex-wrap gap-2">
                  {(selectedConcept.connectedConcepts || ['ArrayList', 'HashMap', 'Set', 'Duplicate Removal']).map((rel, idx) => (
                    <span key={idx} className="text-xs px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-200 border border-purple-500/30 font-semibold">
                      {rel}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  onClick={() => onNavigate && onNavigate('graph')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all shadow-md"
                >
                  View in Knowledge Map
                </button>
              </div>

            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 text-xs">
              Select any concept from the search results to inspect source citations and learning status.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
