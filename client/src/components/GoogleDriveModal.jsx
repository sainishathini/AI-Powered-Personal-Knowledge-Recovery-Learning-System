import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  FolderCheck, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  ArrowRight, 
  RefreshCw, 
  Lock, 
  ExternalLink,
  Layers,
  Network,
  BookOpen
} from 'lucide-react';

export default function GoogleDriveModal({ isOpen, onClose, onIngestionComplete }) {
  // Connection steps:
  // 'initial' = Connect Learning Space screen
  // 'connected' = Choose learning folder screen
  // 'syncing' = Processing multi-step AI ingestion pipeline
  // 'completed' = Ingestion summary
  const [step, setStep] = useState('initial');
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState('folder-college-1');
  const [selectedFolderFiles, setSelectedFolderFiles] = useState([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [syncingProgress, setSyncingProgress] = useState(1);
  const [ingestResult, setIngestResult] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchFolders();
    }
  }, [isOpen]);

  const fetchFolders = async () => {
    setLoadingFolders(true);
    try {
      const res = await fetch('/api/drive/folders');
      if (res.ok) {
        const data = await res.json();
        setFolders(data);
        if (data.length > 0) {
          setSelectedFolderId(data[0].id);
          fetchFolderFiles(data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch Drive folders:', err);
    } finally {
      setLoadingFolders(false);
    }
  };

  const fetchFolderFiles = async (folderId) => {
    try {
      const res = await fetch(`/api/drive/files?folderId=${folderId}`);
      if (res.ok) {
        const files = await res.json();
        setSelectedFolderFiles(files);
      }
    } catch (err) {
      console.error('Failed to fetch folder files:', err);
    }
  };

  if (!isOpen) return null;

  // Step 1 -> Step 2: Handle OAuth connection
  const handleAuthenticate = async () => {
    setIsAuthenticating(true);
    try {
      const res = await fetch('/api/auth/google/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Alex Rivera (Google Student Workspace)',
          email: 'alex.rivera.student@gmail.com'
        })
      });
      if (res.ok) {
        setTimeout(() => {
          setIsAuthenticating(false);
          setStep('connected');
        }, 800);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setIsAuthenticating(false);
    }
  };

  // Step 2 -> Step 3: Handle Folder Ingestion
  const handleIngestFolder = async () => {
    setStep('syncing');
    setSyncingProgress(1);

    // Step animation interval
    const interval = setInterval(() => {
      setSyncingProgress(prev => {
        if (prev < 5) return prev + 1;
        clearInterval(interval);
        return 5;
      });
    }, 700);

    try {
      const res = await fetch('/api/drive/ingest-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderId: selectedFolderId })
      });

      const data = await res.json();

      setTimeout(() => {
        clearInterval(interval);
        setIngestResult(data);
        setStep('completed');
        if (onIngestionComplete) {
          onIngestionComplete(data);
        }
      }, 3600);

    } catch (err) {
      console.error('Folder ingestion error:', err);
      clearInterval(interval);
      setStep('connected');
    }
  };

  const handleReset = () => {
    setStep('initial');
    setSyncingProgress(1);
    setIngestResult(null);
  };

  const selectedFolder = folders.find(f => f.id === selectedFolderId);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-indigo-500/40 p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={step === 'syncing'}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm transition-all border border-slate-700 disabled:opacity-30"
        >
          ✕
        </button>

        {/* STEP 1: CONNECT YOUR LEARNING SPACE */}
        {step === 'initial' && (
          <div className="space-y-6 text-center py-2 animate-fade-in">
            
            {/* Drive Icon Badge */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
              <span className="text-2xl">🔗</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-sans">
                CONNECT YOUR LEARNING SPACE
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                MemoryMap will use the learning folder you choose to build your personal knowledge map.
              </p>
            </div>

            {/* Permission Assurances Box */}
            <div className="bg-slate-900/90 border border-indigo-500/30 p-5 rounded-2xl text-left space-y-3 shadow-inner">
              <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Secure Google OAuth 2.0 Access
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <span><strong>Your files remain in Google Drive</strong> — no files are modified or deleted.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <span><strong>You choose which folder to analyze</strong> — full control over scope.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <span><strong>MemoryMap only processes permitted content</strong> for AI concept mapping.</span>
                </li>
              </ul>
            </div>

            {/* Subtext explanation */}
            <p className="text-[11px] text-slate-400 italic">
              “Connect a folder containing your learning materials. MemoryMap will organize the knowledge inside it.”
            </p>

            {/* Continue Button */}
            <button
              onClick={handleAuthenticate}
              disabled={isAuthenticating}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Requesting Google OAuth Permission...</span>
                </>
              ) : (
                <>
                  <span className="text-base">🔗</span>
                  <span>Continue with Google</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </div>
        )}

        {/* STEP 2: CHOOSE YOUR LEARNING FOLDER */}
        {step === 'connected' && (
          <div className="space-y-6 py-1 animate-fade-in">
            
            {/* Connected Badge */}
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-xl text-emerald-300 text-xs font-bold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Google Drive Connected</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">alex.rivera.student@gmail.com</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-sans">Choose your learning folder</h3>
              <p className="text-xs text-slate-400">
                Select the folder containing your lecture PDFs, presentations, and study notes.
              </p>
            </div>

            {/* Folder Selection List */}
            <div className="space-y-3">
              {folders.map(folder => {
                const isSelected = selectedFolderId === folder.id;
                return (
                  <div
                    key={folder.id}
                    onClick={() => {
                      setSelectedFolderId(folder.id);
                      fetchFolderFiles(folder.id);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-950/60 border-indigo-400 shadow-md shadow-indigo-500/20'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-indigo-400'
                      }`}>
                        <Folder className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white font-sans">{folder.name}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {folder.itemCount} Items
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{folder.description}</p>
                        <div className="text-[10px] text-indigo-300/80 font-mono mt-1">{folder.path}</div>
                      </div>
                    </div>

                    <div className="shrink-0 pt-1">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'bg-indigo-500 border-indigo-400 text-white' : 'border-slate-700'
                      }`}>
                        {isSelected && <span className="text-xs font-bold">✓</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Permitted Files Preview */}
            {selectedFolderFiles.length > 0 && (
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" /> Files to be processed in [{selectedFolder?.name}]:
                </span>
                <div className="space-y-1.5 pt-1">
                  {selectedFolderFiles.map(file => (
                    <div key={file.id} className="flex items-center justify-between text-xs text-slate-300 bg-slate-950/80 p-2 rounded-lg border border-slate-800/80">
                      <span className="font-mono text-[11px] truncate max-w-[280px]">📄 {file.name}</span>
                      <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{file.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep('initial')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleIngestFolder}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Select Folder & Analyze</span>
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: SYNCING & AI INGESTION PIPELINE */}
        {step === 'syncing' && (
          <div className="space-y-8 text-center py-6 animate-fade-in">
            
            <div className="space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 animate-pulse">
                <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <h3 className="text-xl font-bold text-white font-sans">Organizing Google Drive Knowledge</h3>
              <p className="text-xs text-slate-400">
                Reading permitted files from "{selectedFolder?.name}" & generating Knowledge Map
              </p>
            </div>

            {/* 5 Step Progress List */}
            <div className="space-y-3 max-w-md mx-auto text-left">
              {[
                { num: 1, label: 'Connecting to Google Drive API', desc: 'Validating OAuth permissions & folder scope...' },
                { num: 2, label: 'Reading Permitted Study Materials', desc: `Scanning ${selectedFolderFiles.length || 4} PDFs, PPTs, & Notes in folder...` },
                { num: 3, label: 'AI Concept Extraction Engine', desc: 'Extracting definitions, formulas & key terms...' },
                { num: 4, label: 'Finding Prerequisites & Relationships', desc: 'Connecting nodes into personal Knowledge Map...' },
                { num: 5, label: 'Updating MemoryMap System', desc: 'Refreshing Dashboard, Learning Gaps & Recovery Search!' }
              ].map(s => {
                const isDone = syncingProgress > s.num;
                const isCurrent = syncingProgress === s.num;

                return (
                  <div
                    key={s.num}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                      isDone 
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                        : isCurrent
                          ? 'bg-indigo-900/60 border-indigo-400 text-white shadow-md shadow-indigo-500/20 scale-[1.02]'
                          : 'bg-slate-900/40 border-slate-800 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isDone 
                          ? 'bg-emerald-500 text-slate-950' 
                          : isCurrent 
                            ? 'bg-indigo-500 text-white animate-pulse' 
                            : 'bg-slate-800 text-slate-600'
                      }`}>
                        {isDone ? '✓' : s.num}
                      </div>
                      <div>
                        <div className="text-xs font-bold">{s.label}</div>
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

        {/* STEP 4: COMPLETED SUMMARY */}
        {step === 'completed' && ingestResult && (
          <div className="space-y-6 py-2 animate-fade-in">
            
            {/* Top Success Banner */}
            <div className="bg-emerald-950/40 border border-emerald-500/40 p-5 rounded-2xl text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-xl">
                ✓
              </div>
              <h3 className="text-lg font-bold text-white font-sans">Knowledge Map Successfully Updated!</h3>
              <p className="text-xs text-slate-300">
                MemoryMap has organized knowledge from your Google Drive folder <strong>"{ingestResult.folderName}"</strong>.
              </p>
            </div>

            {/* Ingestion Stats Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="glass-card p-3 rounded-xl border border-cyan-500/30">
                <div className="text-2xl font-extrabold text-white">{ingestResult.filesProcessed}</div>
                <div className="text-[10px] font-bold text-cyan-300 uppercase">Files Read</div>
              </div>
              <div className="glass-card p-3 rounded-xl border border-indigo-500/30">
                <div className="text-2xl font-extrabold text-white">{ingestResult.conceptsExtracted}</div>
                <div className="text-[10px] font-bold text-indigo-300 uppercase">Concepts Mapped</div>
              </div>
              <div className="glass-card p-3 rounded-xl border border-purple-500/30">
                <div className="text-2xl font-extrabold text-white">100%</div>
                <div className="text-[10px] font-bold text-purple-300 uppercase">Sync Complete</div>
              </div>
            </div>

            {/* Ingested Materials List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Ingested Study Materials:
              </span>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {ingestResult.ingestedResults?.map((res, idx) => (
                  <div key={idx} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">📄 {res.material?.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                        {res.conceptsCount} Concepts
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{res.summary}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all text-center"
              >
                Go to Dashboard
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
