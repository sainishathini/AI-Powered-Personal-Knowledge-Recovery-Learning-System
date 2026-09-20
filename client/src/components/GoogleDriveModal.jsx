import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  ArrowRight, 
  RefreshCw, 
  BookOpen,
  Power,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

export default function GoogleDriveModal({ isOpen, onClose, onIngestionComplete }) {
  // Steps: 'initial', 'connected', 'syncing', 'completed'
  const [step, setStep] = useState('initial');
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState('folder-college-1');
  const [selectedFolderFiles, setSelectedFolderFiles] = useState([]);
  const [syncingProgress, setSyncingProgress] = useState(1);
  const [ingestResult, setIngestResult] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const [disconnectNotice, setDisconnectNotice] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchFolders();
      fetchStatus();
    }
  }, [isOpen]);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/drive/status');
      if (res.ok) {
        const status = await res.json();
        if (status.isConnected) {
          setStep('connected');
          if (status.autoSync !== undefined) {
            setAutoSyncEnabled(status.autoSync);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch Drive status:', err);
    }
  };

  const fetchFolders = async () => {
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

  // OAuth Authentication Action
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
        }, 700);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setIsAuthenticating(false);
    }
  };

  // Sync Knowledge Action (Step 4 & 5)
  const handleSyncKnowledge = async () => {
    setStep('syncing');
    setSyncingProgress(1);

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

  // Auto Sync Toggle Handler (Section 16)
  const handleToggleAutoSync = async () => {
    const nextVal = !autoSyncEnabled;
    setAutoSyncEnabled(nextVal);
    try {
      await fetch('/api/drive/auto-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextVal })
      });
    } catch (err) {
      console.error('Failed to toggle auto sync:', err);
    }
  };

  // Disconnect Google Drive Handler (Section 17)
  const handleDisconnectDrive = async () => {
    try {
      const res = await fetch('/api/drive/disconnect', { method: 'POST' });
      const data = await res.json();
      setDisconnectNotice(data.message || 'Google Drive disconnected.');
      setShowDisconnectConfirm(false);
      setStep('initial');
      if (onIngestionComplete) onIngestionComplete();
    } catch (err) {
      console.error('Failed to disconnect Google Drive:', err);
    }
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
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed font-medium">
                MemoryMap will use the learning folder you choose to build your personal knowledge map.
              </p>
            </div>

            {/* SECTION 18: PRIVACY / TRUST UI ("YOUR DATA, YOUR CONTROL") */}
            <div className="bg-slate-900/90 border border-indigo-500/30 p-5 rounded-2xl text-left space-y-3 shadow-inner">
              <div className="text-xs font-black text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> YOUR DATA, YOUR CONTROL
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <span><strong>You choose the folder</strong> — select your specific course directory.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <span><strong>We don't need your entire Drive</strong> — restricted file scope.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <span><strong>Only supported learning resources are analyzed</strong> for concept extraction.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <span><strong>You can disconnect Google Drive anytime</strong> with full data control.</span>
                </li>
              </ul>
            </div>

            {/* Subtext explanation */}
            <p className="text-[11px] text-slate-400 italic">
              “Connect a folder containing your learning materials. MemoryMap will organize the knowledge inside it.”
            </p>

            {/* Disconnect notification if recently disconnected */}
            {disconnectNotice && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs text-left">
                {disconnectNotice}
              </div>
            )}

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

        {/* STEP 2: CHOOSE LEARNING FOLDER & SYNC KNOWLEDGE */}
        {step === 'connected' && (
          <div className="space-y-6 py-1 animate-fade-in">
            
            {/* SECTION 20: Real-Looking Connected Badge */}
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
                          <h4 className="text-xs font-bold text-white font-sans">📁 {folder.name}</h4>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                            24 learning resources found
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          24 learning resources • 86 concepts • 42 connections
                        </p>
                        <div className="text-[10px] text-slate-500 font-mono mt-1">Last synced: Just now</div>
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

            {/* SECTION 16: AUTO SYNC SETTING */}
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white font-sans">Automatic Knowledge Sync</div>
                <div className="text-[11px] text-slate-400">
                  MemoryMap checks your selected learning folder for new or changed resources.
                </div>
              </div>

              <button
                onClick={handleToggleAutoSync}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  autoSyncEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                [{autoSyncEnabled ? 'ON' : 'OFF'}]
              </button>
            </div>

            {/* SECTION 17: DISCONNECT GOOGLE DRIVE */}
            {showDisconnectConfirm ? (
              <div className="bg-red-950/40 border border-red-500/40 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-red-300">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span>Disconnect Google Drive Integration?</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Future synchronization will stop and active tokens will be removed. Your existing processed knowledge map remains saved locally in your workspace.
                </p>
                <div className="flex items-center gap-2 justify-end pt-1">
                  <button
                    onClick={() => setShowDisconnectConfirm(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDisconnectDrive}
                    className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-500"
                  >
                    Confirm Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  onClick={() => setShowDisconnectConfirm(true)}
                  className="text-red-400 hover:text-red-300 text-[11px] font-semibold flex items-center gap-1.5"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>Disconnect Google Drive</span>
                </button>
              </div>
            )}

            {/* Action Buttons: Step 4 -> Click [ Sync Knowledge ] */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep('initial')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleSyncKnowledge}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-black uppercase tracking-wider shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2 active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Sync Knowledge</span>
              </button>
            </div>

          </div>
        )}

        {/* STEP 3 & 5: PROCESSING ANIMATION (Extracting, Identifying, Finding, Updating) */}
        {step === 'syncing' && (
          <div className="space-y-8 text-center py-6 animate-fade-in">
            
            <div className="space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 animate-pulse">
                <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <h3 className="text-xl font-bold text-white font-sans">Organizing Google Drive Knowledge</h3>
              <p className="text-xs text-slate-400">
                Syncing permitted files from "{selectedFolder?.name}" into MemoryMap
              </p>
            </div>

            {/* STEP 5 PROCESSING SEQUENCE */}
            <div className="space-y-3 max-w-md mx-auto text-left">
              {[
                { num: 1, label: 'Extracting...', desc: 'Parsing document structures, chapters, and sections...' },
                { num: 2, label: 'Identifying concepts...', desc: 'Extracting definitions, formulas, and key terms...' },
                { num: 3, label: 'Finding relationships...', desc: 'Connecting prerequisite links and conceptual edges...' },
                { num: 4, label: 'Updating knowledge map...', desc: 'Refreshing Knowledge Graph, Learning Gaps & Recovery Index!' }
              ].map(s => {
                const isDone = syncingProgress > s.num;
                const isCurrent = syncingProgress === s.num;

                return (
                  <div
                    key={s.num}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
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
                        <div className="text-xs font-bold font-sans">{s.label}</div>
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

        {/* STEP 6: SYNC RESULT SUMMARY (24 resources, 86 concepts, 42 connections, 7 learning gaps) */}
        {step === 'completed' && ingestResult && (
          <div className="space-y-6 py-2 animate-fade-in">
            
            {/* Top Success Banner */}
            <div className="bg-emerald-950/40 border border-emerald-500/40 p-5 rounded-2xl text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-xl">
                ✓
              </div>
              <h3 className="text-lg font-bold text-white font-sans">Knowledge Map Successfully Updated!</h3>
              <p className="text-xs text-slate-300">
                MemoryMap has organized knowledge from Google Drive folder <strong>"{ingestResult.folderName}"</strong>.
              </p>
            </div>

            {/* STEP 6: COMPETITION METRICS DISPLAY */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="glass-card p-3.5 rounded-xl border border-cyan-500/30">
                <div className="text-2xl font-extrabold text-white font-sans">{ingestResult.filesProcessed}</div>
                <div className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">Resources</div>
              </div>
              <div className="glass-card p-3.5 rounded-xl border border-indigo-500/30">
                <div className="text-2xl font-extrabold text-white font-sans">{ingestResult.conceptsExtracted}</div>
                <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Concepts</div>
              </div>
              <div className="glass-card p-3.5 rounded-xl border border-purple-500/30">
                <div className="text-2xl font-extrabold text-white font-sans">{ingestResult.connectionsCreated}</div>
                <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Connections</div>
              </div>
              <div className="glass-card p-3.5 rounded-xl border border-amber-500/30">
                <div className="text-2xl font-extrabold text-amber-400 font-sans">{ingestResult.learningGapsCount}</div>
                <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Learning Gaps</div>
              </div>
            </div>

            {/* Ingested Materials Preview */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Ingested Study Materials:
              </span>
              <div className="space-y-2 max-h-36 overflow-y-auto">
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
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all text-center"
              >
                Go to Dashboard & Test Knowledge Recovery
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
