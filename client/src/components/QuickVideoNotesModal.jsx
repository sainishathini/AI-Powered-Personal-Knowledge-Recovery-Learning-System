import React, { useState } from 'react';
import { 
  Youtube, 
  Video as VideoIcon, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  FileText, 
  Clock, 
  Upload,
  ArrowRight,
  Play
} from 'lucide-react';

export default function QuickVideoNotesModal({ isOpen, onClose, onRefresh }) {
  const [videoSourceType, setVideoSourceType] = useState('youtube'); // 'youtube' or 'file'
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [title, setTitle] = useState('');
  const [channelName, setChannelName] = useState('EduChannel / Professor');
  const [videoFileContent, setVideoFileContent] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [processResult, setProcessResult] = useState(null);

  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handlePreset = (preset) => {
    setErrorMsg(null);
    if (preset === 'python_youtube') {
      setVideoSourceType('youtube');
      setYoutubeUrl('https://www.youtube.com/watch?v=rfscVS0vtbw');
      setTitle('Python Data Structures & Algorithms Tutorial');
      setChannelName('freeCodeCamp.org');
    } else if (preset === 'ml_youtube') {
      setVideoSourceType('youtube');
      setYoutubeUrl('https://www.youtube.com/watch?v=air-ml-basics-lecture');
      setTitle('Machine Learning Basics — Supervised & Unsupervised');
      setChannelName('MIT OpenCourseWare / StatQuest');
    } else if (preset === 'dbms_youtube') {
      setVideoSourceType('youtube');
      setYoutubeUrl('https://www.youtube.com/watch?v=dbms-normalization-guide');
      setTitle('DBMS Normalization & Relational Schema');
      setChannelName('Gate Smashers / NPTEL');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (videoSourceType === 'youtube' && !youtubeUrl.trim()) {
      setErrorMsg('Unable to analyze this video. Please check the URL or try another video.');
      return;
    }

    setIsProcessing(true);
    setProcessResult(null);

    let endpoint = '/api/materials/process-youtube';
    let payload = {
      url: youtubeUrl.trim(),
      title: title.trim() || undefined,
      channel: channelName.trim() || undefined
    };

    if (videoSourceType === 'file') {
      endpoint = '/api/materials/process-video';
      payload = {
        title: title || selectedFileName || 'DSA_Lecture.mp4',
        transcriptText: videoFileContent || '00:00 Lecture Intro | 15:30 Key concepts explanation.',
        course: 'Computer Science'
      };
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setIsProcessing(false);
        setErrorMsg(data.error || 'Unable to analyze this video. Please check the URL or try another video.');
        return;
      }

      setTimeout(() => {
        setIsProcessing(false);
        setProcessResult(data);
        if (onRefresh) onRefresh();
      }, 1000);
    } catch (err) {
      console.error('Video processing error:', err);
      setIsProcessing(false);
      setErrorMsg('Unable to analyze this video. Please check the URL or try another video.');
    }
  };

  const handleReset = () => {
    setTitle('');
    setYoutubeUrl('');
    setVideoFileContent('');
    setSelectedFileName('');
    setProcessResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-purple-500/40 p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto relative">
        
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Play className="w-3.5 h-3.5 text-purple-400 fill-purple-400" /> Quick Video Notes Engine
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
            QUICK VIDEO NOTES
          </h2>
          <p className="text-xs text-slate-400">
            Turn a YouTube lecture or recorded video file into structured notes, concepts, and Knowledge Map nodes.
          </p>
        </div>

        {/* Presets */}
        <div className="bg-slate-900/90 border border-purple-500/30 p-3.5 rounded-xl space-y-2">
          <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Sample Video Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handlePreset('python_youtube')}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold transition-all flex items-center gap-1.5"
            >
              <Youtube className="w-3.5 h-3.5 text-emerald-400" /> ▶️ Python Tutorial (YouTube)
            </button>
            <button
              type="button"
              onClick={() => handlePreset('ml_youtube')}
              className="text-xs px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-semibold transition-all flex items-center gap-1.5"
            >
              <Youtube className="w-3.5 h-3.5 text-purple-400" /> ▶️ ML Basics (YouTube)
            </button>
            <button
              type="button"
              onClick={() => handlePreset('dbms_youtube')}
              className="text-xs px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 font-semibold transition-all flex items-center gap-1.5"
            >
              <Youtube className="w-3.5 h-3.5 text-cyan-400" /> ▶️ DBMS Guide (YouTube)
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="bg-red-950/60 border border-red-500/50 p-4 rounded-xl text-red-200 text-xs font-bold space-y-1 animate-fade-in">
            <div className="flex items-center gap-2 text-red-400 uppercase tracking-wider font-extrabold text-[11px]">
              ⚠️ Processing Error
            </div>
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-3 border-b border-white/10 pb-4">
          <button
            type="button"
            onClick={() => setVideoSourceType('youtube')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
              videoSourceType === 'youtube'
                ? 'bg-red-500/20 border-red-500 text-red-200 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Youtube className="w-4 h-4 text-red-400" />
            <span>YouTube URL</span>
          </button>

          <button
            type="button"
            onClick={() => setVideoSourceType('file')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
              videoSourceType === 'file'
                ? 'bg-purple-500/20 border-purple-500 text-purple-200 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <VideoIcon className="w-4 h-4 text-purple-400" />
            <span>Upload Video File (MP4/WEBM)</span>
          </button>
        </div>

        {/* Input Form */}
        {!processResult ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {videoSourceType === 'youtube' ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Youtube className="w-4 h-4 text-red-400" />
                    Paste YouTube Video URL
                  </label>
                  <input
                    type="url"
                    required
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-purple-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-400">
                    Paste any public educational lecture or webinar link.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Video Title (Optional)</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Machine Learning Lecture"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Channel / Educator (Optional)</label>
                    <input
                      type="text"
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                      placeholder="e.g. MIT OpenCourseWare"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <VideoIcon className="w-4 h-4 text-purple-400" />
                    Upload Lecture Video File
                  </label>
                  
                  <div className="border-2 border-dashed border-purple-500/40 rounded-xl p-6 text-center space-y-2 bg-slate-900/60 hover:border-purple-400 transition-colors">
                    <Upload className="w-8 h-8 text-purple-400 mx-auto" />
                    <div className="text-xs font-bold text-white">
                      {selectedFileName || 'Drag and drop or click to choose video file'}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Supported formats: MP4, WEBM, MOV (Max 500MB)
                    </p>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFileName(e.target.files[0].name);
                          setTitle(e.target.files[0].name);
                        }
                      }}
                      className="hidden"
                      id="video-file-input"
                    />
                    <label
                      htmlFor="video-file-input"
                      className="inline-block px-4 py-2 rounded-xl bg-purple-600/30 text-purple-200 border border-purple-500/40 text-xs font-bold cursor-pointer hover:bg-purple-600/50 transition-all"
                    >
                      Choose Video File
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Speech Transcript / Timed Key Topics</label>
                  <textarea
                    rows={4}
                    value={videoFileContent}
                    onChange={(e) => setVideoFileContent(e.target.value)}
                    placeholder="00:00 Introduction | 12:42 Key concepts explanation..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>
            )}

            {/* Submit button */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
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
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Extracting Video Notes & Concepts...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{videoSourceType === 'youtube' ? 'Analyze Video' : 'Upload & Analyze Video'}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        ) : (
          /* Processing Result */
          <div className="space-y-5 animate-fade-in">
            <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white font-sans">Quick Video Notes Created & Added to Knowledge Map!</h4>
                <p className="text-xs text-slate-300">{processResult.summary || 'Video transcript parsed, timestamp anchors assigned, and concepts linked.'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-400" /> Extracted Concepts & Video Timestamps ({processResult.concepts?.length || 0}):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {processResult.concepts?.map((c, idx) => (
                  <div key={idx} className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>{c.title || c.name}</span>
                      <span className="text-[10px] text-purple-300 font-mono bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                        {c.location || '12:42'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{c.definition || c.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Analyze Another Video
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-md"
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
