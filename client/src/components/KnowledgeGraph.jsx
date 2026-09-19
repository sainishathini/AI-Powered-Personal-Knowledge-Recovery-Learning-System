import React, { useState, useEffect } from 'react';
import { Network, Filter, Search, BookOpen, Layers, Sparkles, ZoomIn, ZoomOut, RefreshCw, ChevronRight, Eye } from 'lucide-react';

export default function KnowledgeGraph({ onSelectConcept }) {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeNode, setActiveNode] = useState(null);

  useEffect(() => {
    fetchGraph();
  }, []);

  const fetchGraph = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/graph');
      const data = await res.json();
      setGraphData(data);
      if (data.nodes && data.nodes.length > 0) {
        // Select first concept node by default
        const firstConcept = data.nodes.find(n => n.data.kind === 'concept');
        if (firstConcept) setActiveNode(firstConcept);
      }
    } catch (err) {
      console.error('Failed to fetch graph data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter nodes
  const filteredNodes = graphData.nodes.filter(node => {
    const matchesSearch = node.data.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (node.data.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === 'ALL') return matchesSearch;
    if (selectedCategory === 'DOCUMENTS') return matchesSearch && node.data.kind === 'document';
    return matchesSearch && node.data.category === selectedCategory;
  });

  const categories = ['ALL', 'DOCUMENTS', ...new Set(graphData.nodes.map(n => n.data.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      
      {/* Control Bar */}
      <div className="glass-panel p-4 rounded-xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Interactive Personal Knowledge Map</h3>
            <p className="text-[11px] text-slate-400">Visualizing connections between materials, concepts, and prerequisites.</p>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-white font-medium outline-none cursor-pointer"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat} className="bg-slate-900 text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Search Node */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search map node..."
              className="bg-transparent outline-none text-xs w-28 sm:w-36 placeholder-slate-500"
            />
          </div>

          <button
            onClick={fetchGraph}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
            title="Refresh Knowledge Graph"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Main Canvas Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Visual SVG Graph Canvas (2 Columns) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-indigo-500/20 min-h-[480px] flex flex-col justify-between relative overflow-hidden">
          
          {/* Canvas Header */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-4 z-10">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" /> Document Node
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500 ml-2" /> Concept Node
            </span>
            <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
              Showing {filteredNodes.length} nodes
            </span>
          </div>

          {/* SVG Connection Graph Renderer */}
          <div className="relative w-full h-[380px] bg-slate-950/60 rounded-xl border border-slate-800/80 p-4 overflow-auto flex items-center justify-center">
            
            {/* Background Grid Pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#6366f1" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {loading ? (
              <div className="flex flex-col items-center gap-3 text-slate-400">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold">Generating Knowledge Graph Topology...</span>
              </div>
            ) : (
              <div className="relative w-full h-full flex flex-wrap items-center justify-center gap-4 sm:gap-6 p-4">
                
                {filteredNodes.map((node) => {
                  const isConcept = node.data.kind === 'concept';
                  const isSelected = activeNode?.id === node.id;

                  return (
                    <div
                      key={node.id}
                      onClick={() => {
                        setActiveNode(node);
                        if (isConcept && onSelectConcept) {
                          onSelectConcept(node.data);
                        }
                      }}
                      className={`cursor-pointer transition-all duration-300 p-3.5 rounded-xl border flex flex-col gap-1.5 shadow-lg relative group ${
                        isConcept
                          ? isSelected
                            ? 'bg-indigo-900/90 border-indigo-400 shadow-indigo-500/40 scale-105 z-20'
                            : 'bg-slate-900/90 border-indigo-500/30 hover:border-indigo-400 hover:scale-102'
                          : isSelected
                            ? 'bg-cyan-950/90 border-cyan-400 shadow-cyan-500/40 scale-105 z-20'
                            : 'bg-slate-900/90 border-cyan-500/30 hover:border-cyan-400 hover:scale-102'
                      }`}
                      style={{ minWidth: '160px', maxWidth: '220px' }}
                    >
                      {/* Node Header Badge */}
                      <div className="flex items-center justify-between text-[10px]">
                        <span className={`font-bold px-2 py-0.5 rounded-full border ${
                          isConcept 
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
                            : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                        }`}>
                          {isConcept ? (node.data.category || 'Concept') : (node.data.type || 'Document')}
                        </span>

                        {isConcept && node.data.mastery && (
                          <span className="text-emerald-400 font-bold">
                            {node.data.mastery}% Recall
                          </span>
                        )}
                      </div>

                      {/* Label */}
                      <div className="text-xs font-bold text-white truncate font-sans">
                        {node.data.label}
                      </div>

                      {/* Detail hint */}
                      <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-white/5">
                        <span className="truncate">{isConcept ? node.data.sourceDocTitle : `${node.data.pageCount || 10} Pages`}</span>
                        <ChevronRight className="w-3 h-3 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>

                    </div>
                  );
                })}

              </div>
            )}

          </div>

          <p className="text-[11px] text-slate-400 italic text-center mt-3">
            💡 Click any concept node to inspect source citations, definitions, and prerequisite links.
          </p>

        </div>

        {/* Node Detail Inspector Drawer (1 Column) */}
        <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 flex flex-col justify-between space-y-4">
          
          <div className="space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Eye className="w-4 h-4" /> Node Inspector
              </span>
              {activeNode && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                  {activeNode.data.kind === 'concept' ? 'Extracted Concept' : 'Material Source'}
                </span>
              )}
            </div>

            {activeNode ? (
              <div className="space-y-4">
                
                <div>
                  <h4 className="text-lg font-bold text-white font-sans">{activeNode.data.label}</h4>
                  <p className="text-xs text-indigo-300 font-medium">
                    {activeNode.data.category || activeNode.data.course}
                  </p>
                </div>

                {/* Concept specific details */}
                {activeNode.data.kind === 'concept' ? (
                  <>
                    <div className="space-y-1 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Definition</span>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {activeNode.data.definition}
                      </p>
                    </div>

                    <div className="space-y-1 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Source Attribution</span>
                      <p className="text-xs text-white font-bold">{activeNode.data.sourceDocTitle}</p>
                      <p className="text-[11px] text-indigo-400">{activeNode.data.location}</p>
                    </div>

                    {/* Excerpt */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Direct Snippet</span>
                      <p className="text-xs text-slate-300 italic font-mono">
                        “{activeNode.data.snippet}”
                      </p>
                    </div>

                    <button
                      onClick={() => onSelectConcept && onSelectConcept(activeNode.data)}
                      className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
                    >
                      Open Full Concept Drawer
                    </button>
                  </>
                ) : (
                  <div className="space-y-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">File Format:</span>
                      <span className="text-white font-bold">{activeNode.data.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Course / Topic:</span>
                      <span className="text-white font-bold">{activeNode.data.course}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Length:</span>
                      <span className="text-white font-bold">{activeNode.data.pageCount} Pages</span>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                Select any node from the graph to inspect its properties.
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
