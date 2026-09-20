import React, { useState, useEffect } from 'react';
import { Network, Search, Filter, ZoomIn, ZoomOut, Maximize2, Sparkles, BookOpen, Layers, ArrowRight, Eye, RefreshCw, CheckCircle2, AlertTriangle, Compass } from 'lucide-react';

export default function KnowledgeGraph({ onSelectConcept, onNavigate }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [layoutMode, setLayoutMode] = useState('TREE'); // TREE or NETWORK

  // Hierarchical sample graph matching prompt example: JAVA -> COLLECTIONS -> ARRAYLIST/HASHSET/HASHMAP -> LIST/DUPLICATE REMOVAL/KEY-VALUE PAIRS
  const javaTreeNodes = [
    {
      id: 'n-java',
      label: 'JAVA CORE',
      category: 'Root Domain',
      type: 'root',
      mastery: 95,
      definition: 'High-level, class-based, object-oriented programming language designed for platform independence.',
      resources: ['Java_Collections_Framework_Guide.pdf (Overview, Page 1)'],
      related: ['Collections Framework', 'Object-Oriented Programming', 'JVM Memory'],
      status: 'MASTERED',
      nextTopic: 'Collections Framework',
      x: 350, y: 30
    },
    {
      id: 'n-collections',
      label: 'COLLECTIONS FRAMEWORK',
      category: 'Architecture',
      type: 'category',
      mastery: 90,
      definition: 'Unified architecture for representing and manipulating collections of objects in Java.',
      resources: ['Java_Collections_Framework_Guide.pdf (Page 1)'],
      related: ['ArrayList', 'HashSet', 'HashMap'],
      status: 'MASTERED',
      nextTopic: 'ArrayList vs LinkedList Performance',
      x: 350, y: 130
    },
    {
      id: 'n-arraylist',
      label: 'ARRAYLIST',
      category: 'List Data Structures',
      type: 'concept',
      mastery: 92,
      definition: 'Resizable-array implementation of the List interface providing O(1) index retrieval.',
      resources: ['Java_Collections_Framework_Guide.pdf (Section 1, Page 3)'],
      related: ['List Interface', 'Arrays', 'HashSet'],
      status: 'MASTERED',
      nextTopic: 'Custom Comparators & Sorting',
      x: 120, y: 240
    },
    {
      id: 'n-hashset',
      label: 'HASHSET',
      category: 'Set Collections',
      type: 'concept',
      mastery: 85,
      definition: 'Set implementation backed by a hash table. Guarantees element uniqueness with no duplicates.',
      resources: ['Java_Collections_Framework_Guide.pdf (Section 2, Page 7)'],
      related: ['HashMap', 'Duplicate Removal', 'HashCode'],
      status: 'MASTERED',
      nextTopic: 'TreeSet Red-Black Balancing',
      x: 350, y: 240
    },
    {
      id: 'n-hashmap',
      label: 'HASHMAP',
      category: 'Map Structures',
      type: 'concept',
      mastery: 88,
      definition: 'Hash table based Map storing key-value pairs with constant time performance.',
      resources: ['Java_Collections_Framework_Guide.pdf (Section 3, Page 12)'],
      related: ['Key-Value Pairs', 'HashSet', 'Capacity & Load Factor'],
      status: 'MASTERED',
      nextTopic: 'ConcurrentHashMap Thread Safety',
      x: 580, y: 240
    },
    {
      id: 'n-list',
      label: 'LIST INTERFACE',
      category: 'Collection Type',
      type: 'subconcept',
      mastery: 94,
      definition: 'Ordered collection sequence that permits duplicate elements and positional index access.',
      resources: ['Java_Collections_Framework_Guide.pdf (Section 1)'],
      related: ['ArrayList', 'LinkedList', 'Vector'],
      status: 'MASTERED',
      nextTopic: 'ListIterator Navigation',
      x: 80, y: 350
    },
    {
      id: 'n-dup',
      label: 'DUPLICATE REMOVAL',
      category: 'Algorithms',
      type: 'subconcept',
      mastery: 78,
      definition: 'Technique of instantiating a HashSet with an existing Collection to strip duplicate entries in O(N).',
      resources: ['Java_Collections_Framework_Guide.pdf (Section 4, Page 18)'],
      related: ['HashSet', 'ArrayList'],
      status: 'NEEDS_REVIEW',
      nextTopic: 'Stream distinct() API',
      x: 350, y: 350
    },
    {
      id: 'n-keyval',
      label: 'KEY-VALUE PAIRS',
      category: 'Data Mapping',
      type: 'subconcept',
      mastery: 91,
      definition: 'Map entry mapping unique Key objects to value references via hash bucket locations.',
      resources: ['Java_Collections_Framework_Guide.pdf (Section 3)'],
      related: ['HashMap', 'Map.Entry'],
      status: 'MASTERED',
      nextTopic: 'Collision Resolution Chaining',
      x: 620, y: 350
    }
  ];

  const javaTreeEdges = [
    { from: 'n-java', to: 'n-collections', label: 'INCLUDES' },
    { from: 'n-collections', to: 'n-arraylist', label: 'IMPLEMENTS' },
    { from: 'n-collections', to: 'n-hashset', label: 'IMPLEMENTS' },
    { from: 'n-collections', to: 'n-hashmap', label: 'IMPLEMENTS' },
    { from: 'n-arraylist', to: 'n-list', label: 'EXTENDS' },
    { from: 'n-hashset', to: 'n-dup', label: 'ENABLES' },
    { from: 'n-hashmap', to: 'n-keyval', label: 'STORES' }
  ];

  useEffect(() => {
    fetchGraphData();
  }, []);

  const fetchGraphData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/graph');
      const data = await res.json();
      
      if (data && data.nodes && data.nodes.length > 0) {
        const formattedNodes = data.nodes.map((n, idx) => {
          const nData = n.data || n;
          const conceptId = nData.conceptId || n.id || `node-${idx}`;
          const title = nData.label || n.label || 'CONCEPT';
          const sourceDocTitle = nData.sourceDocTitle || 'Ingested Learning Resource';
          const sourceType = nData.sourceType || (sourceDocTitle.endsWith('.mp4') ? 'video' : sourceDocTitle.includes('YouTube') ? 'youtube' : 'file_upload');

          const x = n.x !== undefined ? n.x : 100 + (idx % 3) * 220;
          const y = n.y !== undefined ? n.y : 35 + Math.floor(idx / 3) * 115;

          return {
            id: n.id || `node-${idx}`,
            conceptId,
            label: title.toUpperCase(),
            conceptTitle: title,
            category: nData.category || n.category || 'Core Concept',
            type: n.type || nData.type || (idx === 0 ? 'root' : (nData.category ? 'concept' : 'subconcept')),
            mastery: nData.mastery || n.mastery || Math.floor(Math.random() * 30) + 70,
            definition: nData.definition || nData.snippet || n.definition || 'Extracted learning concept.',
            snippet: nData.snippet || nData.definition || '',
            sourceDocId: nData.sourceDocId || null,
            sourceDocTitle,
            sourceType,
            location: nData.location || 'Indexed',
            resourcesList: [
              {
                title: sourceDocTitle,
                sourceType,
                location: nData.location || 'Indexed',
                sourceUrl: nData.sourceUrl || null
              }
            ],
            resources: Array.isArray(nData.resources) 
              ? nData.resources 
              : [sourceDocTitle ? `${sourceDocTitle} (${nData.location || 'Section 1'})` : 'Uploaded Material'],
            related: nData.connectedConcepts || nData.prerequisites || (nData.related || ['Related Topics']),
            connectedConcepts: nData.connectedConcepts || [],
            prerequisites: nData.prerequisites || [],
            status: (nData.mastery && nData.mastery < 60) ? 'NEEDS_REVIEW' : 'MASTERED',
            nextTopic: (nData.connectedConcepts && nData.connectedConcepts[0]) || 'Advanced Topic',
            x,
            y
          };
        });

        const formattedEdges = (data.edges || []).map(e => ({
          from: e.source || e.from,
          to: e.target || e.to,
          label: e.label || 'CONNECTED_TO'
        }));

        setNodes(formattedNodes);
        setEdges(formattedEdges);
        if (formattedNodes.length > 0) {
          setSelectedNode(formattedNodes[0]);
        }
      } else {
        setNodes([]);
        setEdges([]);
        setSelectedNode(null);
      }
    } catch (err) {
      console.error('Failed to load dynamic graph:', err);
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
    } finally {
      setLoading(false);
    }
  };

  const [selectedResourceFilter, setSelectedResourceFilter] = useState('ALL');

  const resourceOptions = ['ALL', ...new Set(nodes.map(n => n.sourceDocTitle).filter(Boolean))];

  const filteredNodes = nodes.filter(n => {
    const matchesSearch = n.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          n.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          n.definition.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || n.category === selectedCategory;
    const matchesResource = selectedResourceFilter === 'ALL' || n.sourceDocTitle === selectedResourceFilter || n.type === 'root';

    return matchesSearch && matchesCategory && matchesResource;
  });

  const categories = ['ALL', ...new Set(nodes.map(n => n.category))];

  return (
    <div className="space-y-6">
      
      {/* Control Bar Header */}
      <div className="glass-panel p-4 rounded-xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
            <Network className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-sans">Interactive AI Knowledge Map</h2>
            <p className="text-xs text-slate-400">Click any concept node to reveal origin resources, definitions, and next learning topics.</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          
          {/* Resource Source Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedResourceFilter}
              onChange={(e) => setSelectedResourceFilter(e.target.value)}
              className="bg-transparent text-cyan-300 font-medium outline-none cursor-pointer max-w-[140px] truncate"
            >
              {resourceOptions.map((resTitle, idx) => (
                <option key={idx} value={resTitle} className="bg-slate-900 text-white">
                  {resTitle === 'ALL' ? 'All Resources' : resTitle}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
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

          {/* Node Search */}
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

          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-1 text-slate-300">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.4))}
              className="p-1 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono px-1.5 text-slate-400">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.6))}
              className="p-1 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Main Container: Interactive Graph Canvas (Left 2 cols) + Node Inspector Drawer (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Visual Graph Canvas */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-purple-500/30 min-h-[520px] flex flex-col justify-between relative overflow-hidden">
          
          {/* Legend Header */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-4 z-10">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[11px] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500" /> Root Domain
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" /> Category
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm shadow-purple-500" /> Concept
              </span>
            </div>
            
            <span className="text-[11px] bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full text-purple-300 font-mono">
              {filteredNodes.length} Interactive Nodes
            </span>
          </div>

          {/* SVG Connection Lines + Node Layout */}
          <div className="relative w-full h-[440px] bg-slate-950/80 rounded-xl border border-slate-800 p-4 overflow-auto flex items-center justify-center">
            
            {/* Background Neon Grid */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
              <pattern id="graph-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#8b5cf6" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#graph-grid)" />
            </svg>

            {loading ? (
              <div className="flex flex-col items-center gap-3 text-slate-400">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold">Generating Knowledge Topology Graph...</span>
              </div>
            ) : filteredNodes.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 max-w-md mx-auto my-auto z-20">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-3xl font-bold border border-indigo-500/30">
                  🌐
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white font-sans uppercase tracking-tight">YOUR KNOWLEDGE MAP IS EMPTY</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Add your first learning resource to start building your personal knowledge map.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => onNavigate && onNavigate('add_knowledge')}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
                  >
                    + Add Knowledge
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="relative w-full h-full transition-transform duration-300 origin-center"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {/* SVG Directed Arrows connecting nodes */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#8b5cf6" />
                    </marker>
                  </defs>

                  {/* Draw connection lines between nodes */}
                  {edges.map((edge, idx) => {
                    const sourceNode = nodes.find(n => n.id === edge.from);
                    const targetNode = nodes.find(n => n.id === edge.to);

                    if (!sourceNode || !targetNode) return null;

                    // Compute center coordinates
                    const x1 = sourceNode.x + 80;
                    const y1 = sourceNode.y + 25;
                    const x2 = targetNode.x + 80;
                    const y2 = targetNode.y + 25;

                    return (
                      <g key={idx}>
                        <path
                          d={`M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`}
                          fill="none"
                          stroke="#8b5cf6"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                          markerEnd="url(#arrow)"
                          className="opacity-70"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Render Interactive Clickable Nodes */}
                {filteredNodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  const isRoot = node.type === 'root';
                  const isCategory = node.type === 'category';

                  return (
                    <div
                      key={node.id}
                      onClick={() => {
                        setSelectedNode(node);
                        if (onSelectConcept) onSelectConcept(node);
                      }}
                      className={`absolute cursor-pointer transition-all duration-300 p-3 rounded-xl border shadow-xl flex flex-col gap-1 z-10 group ${
                        isRoot
                          ? isSelected
                            ? 'bg-indigo-900 border-indigo-400 shadow-indigo-500/50 scale-110 z-30'
                            : 'bg-slate-900/95 border-indigo-500/40 hover:border-indigo-400 hover:scale-105'
                          : isCategory
                            ? isSelected
                              ? 'bg-cyan-950 border-cyan-400 shadow-cyan-500/50 scale-110 z-30'
                              : 'bg-slate-900/95 border-cyan-500/40 hover:border-cyan-400 hover:scale-105'
                            : isSelected
                              ? 'bg-purple-950 border-purple-400 shadow-purple-500/50 scale-110 z-30'
                              : 'bg-slate-900/95 border-purple-500/40 hover:border-purple-400 hover:scale-105'
                      }`}
                      style={{
                        left: `${node.x}px`,
                        top: `${node.y}px`,
                        width: '160px'
                      }}
                    >
                      {/* Category Badge & Recall Score */}
                      <div className="flex items-center justify-between text-[9px] font-bold">
                        <span className={`px-2 py-0.5 rounded-full border ${
                          isRoot ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' :
                          isCategory ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' :
                          'bg-purple-500/20 text-purple-300 border-purple-500/30'
                        }`}>
                          {node.category}
                        </span>

                        <span className="text-emerald-400">{node.mastery}%</span>
                      </div>

                      {/* Node Label */}
                      <div className="text-xs font-bold text-white truncate font-sans group-hover:text-purple-300 transition-colors">
                        {node.label}
                      </div>

                      {/* Sub-label */}
                      <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-white/5">
                        <span className="truncate">{node.status}</span>
                        <ArrowRight className="w-3 h-3 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>

                    </div>
                  );
                })}

              </div>
            )}

          </div>

          <p className="text-[11px] text-slate-400 italic text-center mt-3 z-10">
            💡 Click any node on the graph canvas to inspect resources, definitions, learning status, and recommended next topics.
          </p>

        </div>

        {/* Node Inspector Drawer (Right Side Card - Fulfills Prompt Requirements) */}
        <div className="glass-panel p-6 rounded-2xl border border-purple-500/40 space-y-5 flex flex-col justify-between">
          
          <div className="space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Eye className="w-4 h-4" /> Concept Inspector
              </span>
              {selectedNode && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                  selectedNode.status === 'MASTERED' 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {selectedNode.status} ({selectedNode.mastery}% Recall)
                </span>
              )}
            </div>

            {selectedNode ? (
              <div className="space-y-4 animate-fade-in">
                
                {/* Title */}
                <div>
                  <h3 className="text-xl font-bold text-white font-sans">{selectedNode.label}</h3>
                  <p className="text-xs text-purple-300 font-semibold">{selectedNode.category}</p>
                </div>

                {/* 1. Definition */}
                <div className="space-y-1 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">1. Definition</span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {selectedNode.definition}
                  </p>
                </div>

                {/* 2. Resources Where It Appears */}
                <div className="space-y-1 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> 2. Resources Where It Appears
                  </span>
                  <div className="space-y-1 pt-1">
                    {selectedNode.resources.map((res, idx) => (
                      <div key={idx} className="text-xs font-bold text-cyan-200 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> {res}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Related Concepts */}
                <div className="space-y-1 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-purple-400" /> 3. Related Concepts
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedNode.related.map((rel, idx) => (
                      <span key={idx} className="text-xs px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                        {rel}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4. Learning Status & 5. Suggested Next Topic */}
                <div className="bg-gradient-to-r from-purple-950/60 to-indigo-950/60 p-3.5 rounded-xl border border-purple-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">4. Learning Status:</span>
                    <span className="text-emerald-400 font-bold">{selectedNode.mastery}% Recall Strength</span>
                  </div>

                  <div className="pt-2 border-t border-white/10 space-y-1">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5" /> 5. Suggested Next Topic
                    </span>
                    <p className="text-xs font-bold text-white">{selectedNode.nextTopic}</p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 text-xs">
                Click any node on the graph to view definition, source resources, and next learning topics.
              </div>
            )}

          </div>

          {/* Action buttons */}
          {selectedNode && (
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => onNavigate && onNavigate('search')}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold hover:from-purple-500 hover:to-indigo-500 transition-all shadow-md"
              >
                Recover Origin Search on {selectedNode.label}
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
