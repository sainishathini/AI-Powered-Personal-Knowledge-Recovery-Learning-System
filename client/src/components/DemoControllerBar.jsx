import React, { useState, useEffect } from 'react';
import { Play, SkipForward, SkipBack, RefreshCw, X, Award, CheckCircle2, Sparkles, Network, Search, AlertTriangle, LayoutDashboard } from 'lucide-react';

export default function DemoControllerBar({
  activeTab,
  setActiveTab,
  onRunDemoQuery,
  onClose
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    {
      id: 1,
      title: 'Step 1: Open Dashboard',
      tab: 'dashboard',
      description: 'Displaying primary CTA: 🔗 Connect Google Drive.',
      actionLabel: 'View Dashboard',
      icon: LayoutDashboard,
      color: 'text-cyan-400'
    },
    {
      id: 2,
      title: 'Step 2: Connect Google Drive',
      tab: 'dashboard',
      description: 'Opening OAuth permission screen & privacy safeguards.',
      actionLabel: 'Open Drive Connection',
      icon: Sparkles,
      color: 'text-indigo-400'
    },
    {
      id: 3,
      title: 'Step 3: Select 📁 College Folder',
      tab: 'dashboard',
      description: 'Selecting College learning folder containing 24 study materials.',
      actionLabel: 'Select Folder',
      icon: LayoutDashboard,
      color: 'text-indigo-400'
    },
    {
      id: 4,
      title: 'Step 4: Sync Knowledge (24 Found)',
      tab: 'dashboard',
      description: 'Showing 24 resources found and clicking Sync Knowledge.',
      actionLabel: 'Sync Knowledge',
      icon: RefreshCw,
      color: 'text-cyan-400'
    },
    {
      id: 5,
      title: 'Step 5: Multi-Stage Processing',
      tab: 'dashboard',
      description: 'Extracting... Identifying concepts... Finding relationships... Updating map.',
      actionLabel: 'View Ingestion Pipeline',
      icon: Sparkles,
      color: 'text-purple-400'
    },
    {
      id: 6,
      title: 'Step 6: Sync Result (24 / 86 / 42 / 7)',
      tab: 'dashboard',
      description: 'Result: 24 resources, 86 concepts, 42 connections, 7 learning gaps.',
      actionLabel: 'View Sync Summary',
      icon: CheckCircle2,
      color: 'text-emerald-400'
    },
    {
      id: 7,
      title: 'Step 7: Ask My Knowledge',
      tab: 'search',
      description: 'Asking: "Where did I learn about HashSet?"',
      actionLabel: 'Ask HashSet Query',
      icon: Search,
      color: 'text-indigo-400',
      action: () => onRunDemoQuery('Where did I learn about HashSet?')
    },
    {
      id: 8,
      title: 'Step 8: Citation & Excerpt',
      tab: 'search',
      description: 'Result: Java Collections.pdf — Page 12 (99% confidence match).',
      actionLabel: 'Inspect Citation',
      icon: Award,
      color: 'text-purple-400'
    },
    {
      id: 9,
      title: 'Step 9: View Knowledge Map',
      tab: 'graph',
      description: 'Path: Java → Collections → HashSet → Duplicate Removal.',
      actionLabel: 'View Knowledge Graph',
      icon: Network,
      color: 'text-emerald-400'
    },
    {
      id: 10,
      title: 'Step 10: Learning Gaps (HashMap 75%)',
      tab: 'gaps',
      description: 'HashMap — 75% (Missing: Collision handling, Hashing mechanism).',
      actionLabel: 'Inspect Learning Gap',
      icon: AlertTriangle,
      color: 'text-amber-400'
    }
  ];

  const activeStepConfig = steps.find(s => s.id === currentStep) || steps[0];

  const goToStep = (stepNumber) => {
    if (stepNumber < 1 || stepNumber > steps.length) return;
    setCurrentStep(stepNumber);
    const target = steps.find(s => s.id === stepNumber);
    if (target) {
      setActiveTab(target.tab);
      if (target.action) {
        target.action();
      }
    }
  };

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length) {
            setIsPlaying(false);
            return 1;
          }
          const next = prev + 1;
          const target = steps.find(s => s.id === next);
          if (target) {
            setActiveTab(target.tab);
            if (target.action) target.action();
          }
          return next;
        });
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, setActiveTab]);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-4xl bg-slate-950/95 backdrop-blur-xl border border-amber-500/40 rounded-2xl shadow-2xl p-4 transition-all duration-300 animate-slide-up">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Left: Badge & Step Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-amber-400 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full uppercase tracking-wider">
                Competition Demo Mode
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Step {currentStep} of {steps.length}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
              <span>{activeStepConfig.title}</span>
            </h4>
            <p className="text-xs text-slate-300 hidden sm:block">
              {activeStepConfig.description}
            </p>
          </div>
        </div>

        {/* Center: Step indicators */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => goToStep(s.id)}
              className={`w-7 h-7 rounded-full text-xs font-bold transition-all flex items-center justify-center ${s.id === currentStep
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/30 scale-110'
                : s.id < currentStep
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                  : 'bg-slate-900 text-slate-500 hover:text-slate-300'
                }`}
            >
              {s.id < currentStep ? <CheckCircle2 className="w-4 h-4" /> : s.id}
            </button>
          ))}
        </div>

        {/* Right: Controller Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => goToStep(currentStep - 1)}
            disabled={currentStep === 1}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 text-xs font-semibold transition-all border border-slate-800"
            title="Previous Step"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-md ${isPlaying
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20'
              }`}
          >
            {isPlaying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause Auto' : 'Auto Tour'}</span>
          </button>

          <button
            onClick={() => goToStep(currentStep + 1)}
            disabled={currentStep === steps.length}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 disabled:opacity-30"
          >
            <span>Next Step</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs transition-all border border-slate-800"
            title="Exit Demo Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
