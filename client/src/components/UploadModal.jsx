import React, { useState } from 'react';
import { Upload, FileText, Sparkles, CheckCircle2, ArrowRight, BookOpen, Layers } from 'lucide-react';

export default function UploadModal({ isOpen, onClose, onRefresh }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('PDF');
  const [course, setCourse] = useState('Deep Learning');
  const [author, setAuthor] = useState('Prof. Vance');
  const [content, setContent] = useState('');
  const [ingesting, setIngesting] = useState(false);
  const [step, setStep] = useState(0); // 0: Idle, 1: Text Ingestion, 2: AI Entity Extraction, 3: Completed

  if (!isOpen) return null;

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIngesting(true);
    setStep(1);

    // Simulated progress transitions
    setTimeout(() => setStep(2), 700);

    try {
      const res = await fetch('/api/materials/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type, course, author, content })
      });

      if (res.ok) {
        setStep(3);
        setTimeout(() => {
          setIngesting(false);
          setStep(0);
          setTitle('');
          setContent('');
          onRefresh();
          onClose();
        }, 1000);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setIngesting(false);
    }
  };

  const loadSample = (sampleType) => {
    if (sampleType === 'dl') {
      setTitle('Generative_Adversarial_Networks_Lecture.pdf');
      setType('PDF');
      setCourse('CS701 - Deep Learning');
      setAuthor('Prof. A. Vance');
      setContent(`Chapter 7: Generative Adversarial Networks (GANs).
Section 7.1: Generator and Discriminator Architecture.
A GAN consists of two neural networks: Generator G that captures the data distribution and Discriminator D that estimates the probability that a sample came from the training data rather than G.
Section 7.2: Minimax Objective Function. The game formulation is min_G max_D V(D,G) = E_x[log D(x)] + E_z[log(1 - D(G(z)))].
Section 7.3: Mode Collapse & Wasserstein GAN (WGAN). Mode collapse occurs when the generator produces only a single sample type that fools the discriminator. WGAN addresses mode collapse using Wasserstein distance and Earth Mover Distance.`);
    } else if (sampleType === 'os') {
      setTitle('Raft_Consensus_Algorithm_Paper.pdf');
      setType('PDF');
      setCourse('CS402 - Distributed Computing');
      setAuthor('Ongaro & Ousterhout');
      setContent(`In Search of an Understandable Consensus Algorithm (Raft):
Section 3: Raft Consensus Basics. Raft decomposes consensus into three subproblems: Leader Election, Log Replication, and Safety.
Section 3.4: Leader Election. Nodes exist in one of three states: Leader, Follower, or Candidate. If a follower receives no communication within election timeout, it starts election.
Section 3.6: Log Matching Property. If two logs contain an entry with same index and term, then the logs are identical in all entries up through the given index.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-indigo-500/40 p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Ingest Learning Material</h3>
              <p className="text-xs text-slate-400">Upload raw text, lecture notes, or PDF contents for AI analysis.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={ingesting}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Quick Demo Preset Load Buttons */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Quick Presentation Demo Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => loadSample('dl')}
              className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold transition-all"
            >
              Load GANs Deep Learning Notes
            </button>
            <button
              type="button"
              onClick={() => loadSample('os')}
              className="text-xs px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 font-semibold transition-all"
            >
              Load Raft Consensus Paper
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleUpload} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Material Title / Filename</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Deep_Learning_Lecture_07.pdf"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Material Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
              >
                <option value="PDF">PDF Document</option>
                <option value="PPT">Presentation PPTX</option>
                <option value="Notes">Handwritten / Markdown Notes</option>
                <option value="Web">Web Article / Link</option>
              </select>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Course / Category</label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. CS701 - Deep Learning"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Author / Professor</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Prof. Vance"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>

          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Content / Document Text</label>
            <textarea
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste raw text content, chapter notes, or document excerpts here..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Progress Indicator */}
          {ingesting && (
            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/40 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin" /> AI Extraction & Knowledge Mapping...
                </span>
                <span className="text-slate-400 font-mono">Step {step}/3</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className={`h-1.5 rounded-full transition-all ${step >= 1 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
                <div className={`h-1.5 rounded-full transition-all ${step >= 2 ? 'bg-purple-500' : 'bg-slate-800'}`} />
                <div className={`h-1.5 rounded-full transition-all ${step >= 3 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
              </div>

              <p className="text-[11px] text-slate-400 font-mono">
                {step === 1 && 'Parsing text structure and chapters...'}
                {step === 2 && 'Extracting core concepts, definitions, and location anchors...'}
                {step === 3 && 'Successfully added nodes to Personal Knowledge Graph!'}
              </p>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={ingesting}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={ingesting}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold transition-all shadow-md hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50"
            >
              {ingesting ? 'Analyzing...' : 'Ingest & Extract Concepts'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
