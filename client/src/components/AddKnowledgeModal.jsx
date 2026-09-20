import React, { useState } from 'react';
import { 
  FileText, 
  Presentation, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Youtube, 
  FileCode, 
  Sparkles, 
  CheckCircle2, 
  Upload, 
  ArrowRight,
  RefreshCw,
  X
} from 'lucide-react';

export default function AddKnowledgeModal({ isOpen, onClose, onRefresh, onOpenDrive, initialTab = 'file' }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'file');

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);
  
  // Form State
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('Computer Science');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processResult, setProcessResult] = useState(null);

  if (!isOpen) return null;

  const handleDemoPreset = (preset) => {
    if (preset === 'image') {
      setActiveTab('image');
      setTitle('DSA_Notes.jpg');
      setContent('OCR Diagram: Linked List architecture showing Head -> Node 1 -> Node 2 -> Tail. Traversal O(N), Insertion at Head O(1).');
    } else if (preset === 'video') {
      setActiveTab('video');
      setTitle('DSA_Lecture.mp4');
      setContent('00:00 Data Structures Overview | 12:42 Linked List insertion algorithm explanation and pointer updates | 34:50 Doubly Linked Lists.');
    } else if (preset === 'note') {
      setActiveTab('note');
      setTitle('My HashSet Notes');
      setContent('HashSet stores unique elements. It does not allow duplicate values. It is backed by a hash table (specifically a HashMap instance). It is useful when duplicate removal is required.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessResult(null);

    let endpoint = '/api/materials/upload';
    let payload = { title, course, content };

    if (activeTab === 'image') {
      endpoint = '/api/materials/process-image';
      payload = { title: title || 'DSA_Notes.jpg', imageText: content, course };
    } else if (activeTab === 'video') {
      endpoint = '/api/materials/process-video';
      payload = { title: title || 'DSA_Lecture.mp4', transcriptText: content, course };
    } else if (activeTab === 'note') {
      endpoint = '/api/materials/process-note';
      payload = { title: title || 'My HashSet Notes', content: content || 'HashSet stores unique elements in Java.' };
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      setTimeout(() => {
        setIsProcessing(false);
        setProcessResult(data);
        if (onRefresh) onRefresh();
      }, 1500);
    } catch (err) {
      console.error('Ingestion error:', err);
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setContent('');
    setProcessResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-indigo-500/40 p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm transition-all border border-slate-700"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> File Resource Ingestion
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
            Upload Learning Resources
          </h2>
          <p className="text-xs text-slate-400">
            Upload actual files from your computer (PDF, PPT, PPTX, DOC, DOCX, TXT, JPG, PNG, MP4, WEBM, MOV) or study notes.
          </p>
        </div>

        {/* Quick Demo Presets */}
        <div className="bg-slate-900/90 border border-indigo-500/30 p-3.5 rounded-xl space-y-2">
          <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Sample Resource Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleDemoPreset('image')}
              className="text-xs px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 font-semibold transition-all flex items-center gap-1.5"
            >
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" /> 🖼️ OCR Diagram (DSA_Notes.jpg)
            </button>
            <button
              type="button"
              onClick={() => handleDemoPreset('video')}
              className="text-xs px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-semibold transition-all flex items-center gap-1.5"
            >
              <VideoIcon className="w-3.5 h-3.5 text-purple-400" /> 🎥 Video Recording (DSA_Lecture.mp4)
            </button>
            <button
              type="button"
              onClick={() => handleDemoPreset('note')}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold transition-all flex items-center gap-1.5"
            >
              <FileCode className="w-3.5 h-3.5 text-emerald-400" /> 📝 Study Notes
            </button>
          </div>
        </div>

        {/* Multi-Source Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border-b border-white/10 pb-3">
          <button
            type="button"
            onClick={() => { onClose(); onOpenDrive(); }}
            className="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-indigo-500/40 bg-indigo-950/60 text-indigo-300 text-[11px] font-bold transition-all hover:bg-indigo-900/60"
          >
            <span className="text-base">🔗</span>
            <span>Google Drive</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-[11px] font-bold transition-all ${
              activeTab === 'file'
                ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>PDF / Document</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('image')}
            className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-[11px] font-bold transition-all ${
              activeTab === 'image'
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            <span>Image / OCR</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-[11px] font-bold transition-all ${
              activeTab === 'video'
                ? 'bg-purple-500/20 border-purple-500 text-purple-200 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <VideoIcon className="w-4 h-4 text-purple-400" />
            <span>Video Recording</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('note')}
            className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-[11px] font-bold transition-all ${
              activeTab === 'note'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span>Notes / Text</span>
          </button>
        </div>

        {/* Input Form */}
        {!processResult ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {activeTab === 'file' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Document Title / Filename</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Java Collections.pdf or DBMS Normalization.pptx"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Document Text Content</label>
                  <textarea
                    required
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste chapter notes or document contents here..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            )}

            {activeTab === 'image' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Image Name / Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. DSA_Notes.jpg or Whiteboard_Diagram.png"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Handwritten Text / Diagram Content (OCR)</label>
                  <textarea
                    required
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Handwritten notes, diagram annotations, or textbook page text..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            )}

            {activeTab === 'video' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Video Lecture Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. DSA_Lecture.mp4"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Speech Transcript / Key Topics</label>
                  <textarea
                    required
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="00:00 Introduction | 12:42 Linked List insertion explanation..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            )}

            {activeTab === 'note' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Note Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. My HashSet Notes"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Quick Note Content</label>
                  <textarea
                    required
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type quick study notes, definitions, or exam revision bullet points..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            )}

            {/* Action Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing & Extracting Concepts...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze & Add to Knowledge Map</span>
                  </>
                )}
              </button>
            </div>

          </form>
        ) : (
          /* Processing Results */
          <div className="space-y-5 animate-fade-in">
            <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white font-sans">Successfully Added to Personal Knowledge Map!</h4>
                <p className="text-xs text-slate-300">{processResult.summary || 'Extracted concepts & relationships.'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Extracted Concepts ({processResult.concepts?.length || 0}):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {processResult.concepts?.map((c, idx) => (
                  <div key={idx} className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>{c.title || c.name}</span>
                      <span className="text-[10px] text-indigo-400 font-mono">{c.location || 'Indexed'}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{c.definition || c.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Add Another Resource
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
