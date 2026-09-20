import React, { useState } from 'react';
import { PlusCircle, Upload, FileText, Presentation, FileCode, Globe, Sparkles, CheckCircle2, ArrowRight, Tag, Layers, RefreshCw, BookOpen, Compass, Check } from 'lucide-react';

export default function AddKnowledge({ onNavigate, onRefresh, onOpenDrive }) {
  const [activeInputType, setActiveInputType] = useState('GDRIVE'); // GDRIVE, PDF, PPT, NOTES, PASTE, URL
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('Computer Science');
  const [author, setAuthor] = useState('Student Note');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  
  // Processing Pipeline States: 0 = Idle, 1 = Processing, 2 = Completed
  const [status, setStatus] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [extractedData, setExtractedData] = useState(null);

  const processingSteps = [
    { num: 1, title: 'Uploading Resource', desc: 'Receiving raw document payload & buffering...' },
    { num: 2, title: 'Extracting Content', desc: 'Parsing document structure, layout & sections...' },
    { num: 3, title: 'Identifying Concepts', desc: 'Running AI entity extraction & semantic definitions...' },
    { num: 4, title: 'Finding Relationships', desc: 'Mapping prerequisite links & conceptual edges...' },
    { num: 5, title: 'Adding to MemoryMap', desc: 'Indexing nodes into personal Knowledge Map!' }
  ];

  const handleDemoPreset = (preset) => {
    if (preset === 'java') {
      setActiveInputType('PDF');
      setTitle('Java Collections Framework Guide.pdf');
      setCourse('CS201 - Data Structures');
      setAuthor('Prof. J. Gosling');
      setContent(`Java Collections Framework Overview:
Section 1: The List Interface & ArrayList.
ArrayList is a dynamically resizable array implementation of the List interface. It provides O(1) time complexity for position-based element retrieval.
Section 2: The Set Interface & HashSet.
HashSet implements the Set interface, backed by a hash table (specifically a HashMap instance). HashSet guarantees unique elements and prevents duplicate insertion.
Section 3: The Map Interface & HashMap.
HashMap stores key-value pairs using hashing algorithms. It permits null keys and null values.
Section 4: Duplicate Removal Algorithm.
To quickly remove duplicate elements from an ArrayList, pass the list into a HashSet constructor: List<String> uniqueList = new ArrayList<>(new HashSet<>(originalList)).`);
    } else if (preset === 'ml') {
      setActiveInputType('PDF');
      setTitle('Machine_Learning_Lecture_09_Neural_Nets.pdf');
      setCourse('CS701 - Artificial Intelligence');
      setAuthor('Dr. Andrew N.');
      setContent(`Chapter 9: Backpropagation & Optimization in Neural Networks.
Section 9.1: Gradient Descent & Loss Functions. Neural networks optimize weight parameters by computing partial derivatives using the Chain Rule.
Section 9.2: Vanishing Gradient Problem. In deep architectures with sigmoid activations, gradients diminish exponentially toward zero during backprop, stalling weight updates in early layers.
Section 9.3: Residual Skip Connections (ResNets). Skip connections pass identity signals f(x) + x directly across layers, allowing unobstructed gradient flow.`);
    }
  };

  const handleProcess = async (e) => {
    e.preventDefault();
    const finalTitle = title.trim() || (activeInputType === 'URL' ? url : 'Untitled Learning Material');
    const finalContent = content.trim() || (activeInputType === 'URL' ? `Web Resource content indexed from ${url}` : 'Sample learning notes content.');

    setStatus(1);
    setCurrentStep(1);

    // Simulated step-by-step progress pipeline
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 5) return prev + 1;
        clearInterval(interval);
        return 5;
      });
    }, 600);

    try {
      const res = await fetch('/api/materials/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: finalTitle,
          type: activeInputType === 'PASTE' ? 'Notes' : activeInputType,
          course,
          author,
          content: finalContent
        })
      });

      const data = await res.json();

      setTimeout(() => {
        clearInterval(interval);
        setExtractedData(data);
        setStatus(2); // Completed
        if (onRefresh) onRefresh();
      }, 3200);

    } catch (err) {
      console.error('Ingestion error:', err);
      clearInterval(interval);
      setStatus(0);
    }
  };

  const resetForm = () => {
    setStatus(0);
    setCurrentStep(1);
    setExtractedData(null);
    setTitle('');
    setContent('');
    setUrl('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-sans">Add Knowledge Material</h1>
            <p className="text-xs text-slate-400">
              Connect your Google Drive learning space or ingest PDFs, PPTs, and notes.
            </p>
          </div>
        </div>

        {status === 2 && (
          <button
            onClick={resetForm}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Ingest Another Resource</span>
          </button>
        )}
      </div>

      {/* STEP 0: Input Form View */}
      {status === 0 && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
          
          {/* Google Drive Primary Connect Callout */}
          <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/40 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-2 uppercase tracking-wider">
                <span className="text-base">🔗</span> Recommended Knowledge Workflow
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Zero Manual Upload
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-sans">Connect Your Google Drive Learning Space</h3>
              <p className="text-xs text-slate-300">
                Turn your existing Google Drive study materials into your personal knowledge map automatically.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenDrive}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 active:scale-95"
              >
                <span className="text-base">🔗</span>
                <span>Connect Google Drive</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preset Demo Banner */}
          <div className="bg-slate-900/90 border border-indigo-500/30 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Manual File Ingestion Fallback
              </span>
              <span className="text-[10px] text-slate-400">Direct upload</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleDemoPreset('java')}
                className="text-xs px-3.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 font-semibold transition-all"
              >
                📄 Load "Java Collections.pdf"
              </button>
              <button
                type="button"
                onClick={() => handleDemoPreset('ml')}
                className="text-xs px-3.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/40 font-semibold transition-all"
              >
                📄 Load "Machine Learning Neural Nets.pdf"
              </button>
            </div>
          </div>

          {/* Format Type Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Material Format</label>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              <button
                type="button"
                onClick={onOpenDrive}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-indigo-500/50 bg-indigo-600/30 text-white shadow-lg hover:border-indigo-400 text-xs font-bold transition-all"
              >
                <span className="text-lg">🔗</span>
                <span>Google Drive</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveInputType('PDF')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  activeInputType === 'PDF' 
                    ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-lg' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-5 h-5 text-red-400" />
                <span>Upload PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveInputType('PPT')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  activeInputType === 'PPT' 
                    ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-lg' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Presentation className="w-5 h-5 text-orange-400" />
                <span>Upload PPTX</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveInputType('NOTES')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  activeInputType === 'NOTES' 
                    ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-lg' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <FileCode className="w-5 h-5 text-cyan-400" />
                <span>Notes / Text</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveInputType('PASTE')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  activeInputType === 'PASTE' 
                    ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-lg' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-5 h-5 text-purple-400" />
                <span>Paste Text</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveInputType('URL')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  activeInputType === 'URL' 
                    ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-lg' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-5 h-5 text-emerald-400" />
                <span>Web URL</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleProcess} className="space-y-4 pt-2">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Resource Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Java Collections.pdf or Deep Learning Notes.md"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Course / Subject Module</label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. CS201 - Data Structures"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {activeInputType === 'URL' ? (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Web Article / Documentation URL</label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://docs.oracle.com/javase/tutorial/collections/"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Document Text Content / Chapter Notes</label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste document text, code explanations, or handwritten lecture notes here..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono leading-relaxed"
                />
              </div>
            )}

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Process & Add to MemoryMap</span>
              </button>
            </div>

          </form>

        </div>
      )}

      {/* STEP 1: Professional Processing Flow Animation */}
      {status === 1 && (
        <div className="glass-panel p-8 sm:p-12 rounded-2xl border border-indigo-500/40 text-center space-y-8">
          
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 animate-pulse">
              <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">AI Knowledge Ingestion Pipeline</h2>
            <p className="text-xs text-slate-400">Processing "{title || 'Learning Resource'}" into MemoryMap Knowledge Map</p>
          </div>

          {/* 5 Step Progress Timeline */}
          <div className="max-w-xl mx-auto space-y-3">
            {processingSteps.map((s) => {
              const isDone = currentStep > s.num;
              const isCurrent = currentStep === s.num;

              return (
                <div
                  key={s.num}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                    isDone 
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                      : isCurrent
                        ? 'bg-indigo-900/60 border-indigo-400 text-white shadow-md shadow-indigo-500/20 scale-[1.02]'
                        : 'bg-slate-900/40 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isDone 
                        ? 'bg-emerald-500 text-slate-950' 
                        : isCurrent 
                          ? 'bg-indigo-500 text-white animate-pulse' 
                          : 'bg-slate-800 text-slate-500'
                    }`}>
                      {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                    </div>

                    <div className="text-left">
                      <div className="text-xs font-bold">{s.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{s.desc}</div>
                    </div>
                  </div>

                  {isCurrent && (
                    <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* STEP 2: Post-Processing Results Summary View */}
      {status === 2 && extractedData && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Top Success Banner */}
          <div className="glass-panel p-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Ingestion Complete</span>
                <h2 className="text-lg font-bold text-white">Successfully Added to MemoryMap!</h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('graph')}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all shadow-md"
              >
                View in Knowledge Map
              </button>
              <button
                onClick={() => onNavigate('search')}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 transition-all border border-slate-700"
              >
                Test Recovery Search
              </button>
            </div>
          </div>

          {/* Resource Source Info Box */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white font-sans">
                  Resource: {extractedData.material?.title || title}
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                {extractedData.material?.type || activeInputType}
              </span>
            </div>

            {/* AI Summary */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Executive Summary</span>
              <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                {extractedData.summary}
              </p>
            </div>

            {/* Extracted Concepts Cards (The Prompt Example: ArrayList, HashSet, HashMap, etc.) */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Detected Concepts ({extractedData.concepts?.length || 0})
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {extractedData.concepts?.map((c, idx) => (
                  <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{c.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                        {c.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{c.definition}</p>
                    <div className="text-[10px] text-indigo-400 font-mono pt-1">{c.location}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-cyan-400" /> Extracted Keywords
              </span>
              <div className="flex flex-wrap gap-1.5">
                {extractedData.keywords?.map((kw, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 border border-slate-700 font-mono">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Concepts */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" /> Related Graph Connections
              </span>
              <div className="flex flex-wrap gap-1.5">
                {extractedData.relatedConcepts?.map((rc, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                    {rc}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
