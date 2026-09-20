import React, { useState, useEffect } from 'react';
import { 
  Presentation, 
  Sparkles, 
  FileText, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Edit3, 
  CheckCircle2, 
  Layers, 
  BookOpen, 
  Youtube, 
  Image as ImageIcon, 
  RefreshCw, 
  ArrowRight,
  Sliders,
  Check,
  Globe
} from 'lucide-react';

export default function PresentationAI({ initialTopic = '', initialResourceId = null, onNavigate }) {
  // Input State
  const [topic, setTopic] = useState(initialTopic || 'Machine Learning');
  const [useMemoryMapKnowledge, setUseMemoryMapKnowledge] = useState(true);
  const [presentationType, setPresentationType] = useState('Seminar');
  const [slideCountSelect, setSlideCountSelect] = useState('8');
  const [customSlideCount, setCustomSlideCount] = useState(13);
  const [audience, setAudience] = useState('College Students');
  const [language, setLanguage] = useState('English');
  const [selectedResources, setSelectedResources] = useState(initialResourceId ? [initialResourceId] : ['ALL']);

  // Data State
  const [materials, setMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(true);

  // Processing State
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentPresentation, setCurrentPresentation] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Active Preview State
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isEditingSlide, setIsEditingSlide] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editBulletsText, setEditBulletsText] = useState('');

  const presentationTypes = [
    'Seminar',
    'Technical Presentation',
    'Class Presentation',
    'Project Presentation',
    'Paper Presentation',
    'Workshop',
    'Study Presentation'
  ];

  const processingSteps = [
    { num: 1, title: 'Understanding Selected Resources', desc: 'Scanning MemoryMap indexed document segments & notes...' },
    { num: 2, title: 'Identifying Core Concepts', desc: 'Extracting key definitions, runtime tradeoffs & properties...' },
    { num: 3, title: 'Organizing Presentation Structure', desc: 'Structuring slide outline, introduction & section headers...' },
    { num: 4, title: 'Writing Slide Content', desc: 'Formulating bullet points, explanations & speaker notes...' },
    { num: 5, title: 'Building Native PowerPoint .pptx File', desc: 'Applying widescreen 16:9 theme & formatting PowerPoint file...' }
  ];

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    if (initialTopic) setTopic(initialTopic);
    if (initialResourceId) setSelectedResources([initialResourceId]);
  }, [initialTopic, initialResourceId]);

  const fetchMaterials = async () => {
    try {
      const res = await fetch('/api/materials');
      const data = await res.json();
      setMaterials(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch materials:', err);
    } finally {
      setLoadingMaterials(false);
    }
  };

  const toggleResourceSelection = (id) => {
    if (id === 'ALL') {
      setSelectedResources(['ALL']);
      return;
    }

    let next = selectedResources.filter(r => r !== 'ALL');
    if (next.includes(id)) {
      next = next.filter(r => r !== id);
    } else {
      next.push(id);
    }

    if (next.length === 0) next = ['ALL'];
    setSelectedResources(next);
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setIsGenerating(true);
    setCurrentStep(1);
    setCurrentPresentation(null);
    setErrorMessage(null);

    const targetSlideCount = slideCountSelect === 'Custom' 
      ? Math.min(Math.max(parseInt(customSlideCount, 10) || 13, 5), 20)
      : parseInt(slideCountSelect, 10);

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 5) return prev + 1;
        clearInterval(interval);
        return 5;
      });
    }, 600);

    try {
      const res = await fetch('/api/presentations/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim() || 'Machine Learning',
          type: presentationType,
          slideCount: targetSlideCount,
          resourceIds: selectedResources,
          language,
          audience
        })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        clearInterval(interval);
        setIsGenerating(false);
        setErrorMessage(data.error || 'Failed to generate presentation PowerPoint file.');
        return;
      }

      setTimeout(() => {
        clearInterval(interval);
        setIsGenerating(false);
        if (data.success && data.presentation) {
          setCurrentPresentation(data.presentation);
          setActiveSlideIdx(0);
        }
      }, 3200);

    } catch (err) {
      console.error('Presentation generation error:', err);
      clearInterval(interval);
      setIsGenerating(false);
      setErrorMessage('We couldn\'t create the PowerPoint right now. Please try again.');
    }
  };

  const handleDownloadPptx = () => {
    if (!currentPresentation) return;
    const downloadUrl = `/api/presentations/${currentPresentation.id}/download`;
    window.open(downloadUrl, '_blank');
  };

  const openSlideEdit = (slide) => {
    setEditTitle(slide.title);
    setEditSubtitle(slide.subtitle || '');
    setEditBulletsText(slide.bullets ? slide.bullets.join('\n') : '');
    setIsEditingSlide(true);
  };

  const saveSlideEdit = async () => {
    if (!currentPresentation) return;
    const updatedSlides = [...currentPresentation.slides];
    const newBullets = editBulletsText.split('\n').filter(b => b.trim().length > 0);

    updatedSlides[activeSlideIdx] = {
      ...updatedSlides[activeSlideIdx],
      title: editTitle,
      subtitle: editSubtitle,
      bullets: newBullets
    };

    try {
      const res = await fetch(`/api/presentations/${currentPresentation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides: updatedSlides })
      });
      const data = await res.json();
      if (data.success && data.presentation) {
        setCurrentPresentation(data.presentation);
      }
    } catch (err) {
      console.error('Failed to save slide edit:', err);
    } finally {
      setIsEditingSlide(false);
    }
  };

  const currentSlide = currentPresentation?.slides[activeSlideIdx];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Workspace Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-xl shadow-purple-500/30">
            <Presentation className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">Presentation AI</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                PPTX Generator
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Turn your MemoryMap learning materials directly into ready-to-present PowerPoint PPTX files.
            </p>
          </div>
        </div>

        {currentPresentation && (
          <button
            onClick={() => setCurrentPresentation(null)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Create Another Presentation</span>
          </button>
        )}
      </div>

      {/* GENERATION FORM (Shown when no active generated presentation preview) */}
      {!currentPresentation && !isGenerating && (
        <form onSubmit={handleGenerate} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Presentation Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Machine Learning, Java Collections Framework, DBMS Normalization..."
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-sans font-semibold"
              required
            />
            {/* Quick Topic Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[11px] text-slate-400 self-center">Quick Topics:</span>
              {['Machine Learning', 'Java Collections Framework', 'DBMS Normalization', 'Linked List Architecture'].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTopic(chip)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 font-medium transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle: Use MemoryMap Knowledge */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Use My MemoryMap Knowledge
              </span>
              <p className="text-[11px] text-slate-400">
                Extract definitions, algorithms, and references directly from your processed study files.
              </p>
            </div>
            <input
              type="checkbox"
              checked={useMemoryMapKnowledge}
              onChange={(e) => setUseMemoryMapKnowledge(e.target.checked)}
              className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Select Knowledge Sources */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              Select Knowledge Sources ({selectedResources.includes('ALL') ? 'All Knowledge' : `${selectedResources.length} Selected`})
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
              <div
                onClick={() => toggleResourceSelection('ALL')}
                className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                  selectedResources.includes('ALL')
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <span>Use All MemoryMap Knowledge</span>
                </div>
                {selectedResources.includes('ALL') && <Check className="w-4 h-4 text-indigo-400" />}
              </div>

              {materials.map((mat) => {
                const isSelected = selectedResources.includes(mat.id);
                return (
                  <div
                    key={mat.id}
                    onClick={() => toggleResourceSelection(mat.id)}
                    className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-sm">
                        {mat.sourceType === 'youtube' ? '▶️' : mat.sourceType === 'image' ? '🖼️' : mat.sourceType === 'google_drive' ? '🔗' : '📄'}
                      </span>
                      <span className="truncate">{mat.title}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="bg-red-950/60 border border-red-500/40 p-4 rounded-xl text-red-200 text-xs font-semibold flex items-center justify-between">
              <span>{errorMessage}</span>
              <button type="button" onClick={() => setErrorMessage(null)} className="text-red-400 font-bold ml-2">✕</button>
            </div>
          )}

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            
            {/* Presentation Type */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Presentation Type</label>
              <select
                value={presentationType}
                onChange={(e) => setPresentationType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer"
              >
                {presentationTypes.map((pt, idx) => (
                  <option key={idx} value={pt} className="bg-slate-900 text-white">{pt}</option>
                ))}
              </select>
            </div>

            {/* Slide Count */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Number of Slides</label>
              <select
                value={slideCountSelect}
                onChange={(e) => setSlideCountSelect(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer"
              >
                {['5', '6', '7', '8', '10', '12', '15', 'Custom'].map(val => (
                  <option key={val} value={val} className="bg-slate-900 text-white">
                    {val === 'Custom' ? 'Custom' : `${val} Slides`}
                  </option>
                ))}
              </select>
              {slideCountSelect === 'Custom' && (
                <div className="pt-1.5 space-y-1">
                  <label className="text-[10px] font-semibold text-indigo-300">Custom Count (5-20 Slides):</label>
                  <input
                    type="number"
                    min={5}
                    max={20}
                    value={customSlideCount}
                    onChange={(e) => setCustomSlideCount(e.target.value)}
                    placeholder="Enter slide count (5-20)"
                    className="w-full bg-slate-900 border border-indigo-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              )}
            </div>

            {/* Audience */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target Audience</label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer"
              >
                {['College Students', 'Faculty / Researchers', 'Industry Professionals', 'General Audience'].map((aud, idx) => (
                  <option key={idx} value={aud} className="bg-slate-900 text-white">{aud}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Sparkles className="w-5 h-5 text-white" />
            <span>Generate Presentation PPTX</span>
          </button>

        </form>
      )}

      {/* PROCESSING SCREEN */}
      {isGenerating && (
        <div className="glass-panel p-10 rounded-2xl border border-purple-500/40 text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto text-2xl font-bold animate-bounce border border-purple-500/40">
            🪄
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white font-sans uppercase tracking-tight">Creating Your Presentation</h3>
            <p className="text-xs text-slate-400">Synthesizing processed MemoryMap knowledge into PowerPoint slides...</p>
          </div>

          <div className="max-w-md mx-auto bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 text-left">
            {processingSteps.map((step) => {
              const isDone = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <div key={step.num} className="flex items-center gap-3 text-xs">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isDone ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-purple-600 text-white animate-pulse' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {isDone ? '✓' : step.num}
                  </div>
                  <div className="space-y-0.5">
                    <span className={`font-bold ${isCurrent ? 'text-purple-300' : isDone ? 'text-slate-300' : 'text-slate-500'}`}>
                      {step.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* GENERATED PRESENTATION PREVIEW & PPTX DOWNLOAD */}
      {currentPresentation && !isGenerating && currentSlide && (
        <div className="space-y-6">
          
          {/* Top Bar Controls */}
          <div className="glass-panel p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white font-sans">{currentPresentation.title}</h2>
              <p className="text-xs text-slate-400">
                {currentPresentation.slideCount} Slides • Source Materials: {currentPresentation.sourceMaterials?.length || 1} Indexed Sources
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => openSlideEdit(currentSlide)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-purple-500/40 text-slate-200 text-xs font-bold transition-all"
              >
                <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                <span>Edit Current Slide</span>
              </button>

              <button
                onClick={handleDownloadPptx}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download .PPTX</span>
              </button>
            </div>
          </div>

          {/* Slide Preview Canvas (Widescreen 16:9 Slide Viewer) */}
          <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-purple-500/40 bg-slate-950/95 space-y-6 shadow-2xl relative">
            
            {/* Slide Navigation Header */}
            <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
              <span className="font-mono text-purple-300 font-bold uppercase tracking-wider">
                SLIDE {activeSlideIdx + 1} OF {currentPresentation.slides.length} — {currentSlide.category}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={activeSlideIdx === 0}
                  onClick={() => setActiveSlideIdx(prev => Math.max(prev - 1, 0))}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40 text-slate-300 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono text-slate-400 text-[11px]">{activeSlideIdx + 1} / {currentPresentation.slides.length}</span>
                <button
                  disabled={activeSlideIdx === currentPresentation.slides.length - 1}
                  onClick={() => setActiveSlideIdx(prev => Math.min(prev + 1, currentPresentation.slides.length - 1))}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40 text-slate-300 hover:text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Widescreen 16:9 Slide Frame */}
            <div className="aspect-[16/9] w-full max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 flex flex-col justify-between shadow-xl relative overflow-hidden">
              
              {/* Accent Bar */}
              <div className="w-16 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 mb-2" />

              {/* Title & Subtitle */}
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight leading-tight">
                  {currentSlide.title}
                </h3>
                {currentSlide.subtitle && (
                  <p className="text-xs sm:text-sm text-cyan-400 font-semibold">{currentSlide.subtitle}</p>
                )}
              </div>

              {/* Bullet Content Box */}
              <div className="my-4 bg-slate-950/70 p-5 rounded-xl border border-slate-800/80 space-y-2 flex-1 overflow-y-auto">
                {currentSlide.bullets?.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed font-normal">
                    <span className="text-purple-400 font-bold text-sm shrink-0">•</span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              {/* Slide Footer */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-white/5 pt-2">
                <span>MemoryMap Presentation AI</span>
                <span>Slide {currentSlide.slideNumber}</span>
              </div>

            </div>

            {/* Speaker Notes Callout */}
            {currentSlide.speakerNotes && (
              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-xs text-slate-400 space-y-1">
                <span className="font-bold text-purple-300 uppercase tracking-wider text-[10px]">🎙️ Speaker Notes:</span>
                <p className="text-slate-300 italic">{currentSlide.speakerNotes}</p>
              </div>
            )}

            {/* Download CTA Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="text-xs text-slate-400">
                Generated PowerPoint file: <span className="text-indigo-300 font-mono">{currentPresentation.fileName}</span>
              </div>
              <button
                onClick={handleDownloadPptx}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download .PPTX File</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* SLIDE EDIT MODAL */}
      {isEditingSlide && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-purple-500/40 p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Edit Slide {activeSlideIdx + 1}</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Slide Title:</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Slide Subtitle:</label>
                <input
                  type="text"
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Slide Bullets (one per line):</label>
                <textarea
                  rows={5}
                  value={editBulletsText}
                  onChange={(e) => setEditBulletsText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsEditingSlide(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={saveSlideEdit}
                className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
