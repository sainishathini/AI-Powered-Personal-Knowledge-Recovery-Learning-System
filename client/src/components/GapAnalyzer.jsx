import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, AlertCircle, ArrowRight, BookOpen, Sparkles, TrendingUp, Award, RefreshCw, Check, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function GapAnalyzer({ onNavigate }) {
  const [gapsData, setGapsData] = useState({ gaps: [], quizzes: [] });
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResults, setQuizResults] = useState({});
  const [activeLearnNext, setActiveLearnNext] = useState(null);

  useEffect(() => {
    fetchGaps();
  }, []);

  const fetchGaps = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gaps');
      const data = await res.json();
      setGapsData(data);
    } catch (err) {
      console.error('Failed to fetch gaps data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (quizId, optionIdx) => {
    setSelectedAnswers(prev => ({ ...prev, [quizId]: optionIdx }));
  };

  const verifyQuiz = async (quizId) => {
    const selected = selectedAnswers[quizId];
    if (selected === undefined) return;

    try {
      const res = await fetch('/api/gaps/quiz/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId, selectedOption: selected })
      });
      const result = await res.json();
      setQuizResults(prev => ({ ...prev, [quizId]: result }));
    } catch (err) {
      console.error('Error verifying quiz:', err);
    }
  };

  const chartData = [
    { name: 'HashMap', progress: 75, color: '#8b5cf6' },
    { name: 'Positional Encodings', progress: 40, color: '#ef4444' },
    { name: 'Dying ReLU', progress: 55, color: '#f59e0b' },
    { name: 'ArrayList', progress: 95, color: '#10b981' },
    { name: 'HashSet', progress: 90, color: '#06b6d4' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Overview Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-amber-500/30 bg-amber-950/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-sans">Learning Gaps</h1>
            <p className="text-xs text-slate-400">
              Analyzing concepts you have learned to identify partially covered areas and recommended next steps.
            </p>
          </div>
        </div>

        <button
          onClick={fetchGaps}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold border border-slate-700 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Re-Analyze Gaps</span>
        </button>
      </div>

      {/* Feature E: Concept Progress Cards with Covered (✓) vs Missing (⚠) Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white font-sans flex items-center gap-2">
            <Zap className="w-4.5 h-4.5 text-amber-400" />
            Partially Covered Concept Analysis
          </h2>
          <span className="text-xs text-slate-400">Target: 100% Mastery</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gapsData.gaps.map((item) => (
            <div
              key={item.id}
              className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4 hover:border-amber-500/40 flex flex-col justify-between group transition-all"
            >
              <div className="space-y-3">
                
                {/* Header Title & Progress % */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-white font-sans uppercase tracking-tight">{item.concept || item.topic}</h3>
                  <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                    item.progress >= 70 
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                      : item.progress >= 50
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-red-500/20 text-red-300 border-red-500/30'
                  }`}>
                    {item.progress}%
                  </span>
                </div>

                {/* Section 15: Learning Coverage Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                    <span>Learning Coverage</span>
                    <span className="text-purple-300 font-bold">{item.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>

                {/* Covered Checkmarks list */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Covered Concepts</span>
                  <div className="space-y-1">
                    {item.covered?.map((cov, i) => (
                      <div key={i} className="text-xs text-emerald-300 font-medium flex items-center gap-1.5">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{cov}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Warnings list */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-amber-400/80 uppercase tracking-wider">Identified Gaps</span>
                  <div className="space-y-1">
                    {item.missing?.map((mis, i) => (
                      <div key={i} className="text-xs text-amber-300 font-medium flex items-center gap-1.5">
                        <span className="text-amber-400 font-bold">⚠</span>
                        <span>{mis}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Suggested Next Topic & Learn Next Button */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="text-[11px] text-slate-400">
                  Suggested next topic: <strong className="text-white">{item.suggestedNext}</strong>
                </div>

                <button
                  onClick={() => setActiveLearnNext(item)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20 active:scale-95"
                >
                  <span>Learn Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Learn Next Recommendation Modal */}
      {activeLearnNext && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-amber-500/40 p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Targeted Study: {activeLearnNext.suggestedNext}</h3>
              </div>
              <button
                onClick={() => setActiveLearnNext(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                MemoryMap recommends studying <strong>{activeLearnNext.suggestedNext}</strong> in document <strong>{activeLearnNext.recommendedDoc}</strong> to resolve the missing concepts ({activeLearnNext.missing?.join(', ')}).
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setActiveLearnNext(null);
                  if (onNavigate) onNavigate('search');
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs"
              >
                Search Source Origin
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Mastery Breakdown Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Concept Progress Distribution
          </h3>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#8b5cf6', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="progress" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.progress < 60 ? '#f59e0b' : entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quizzes Verification */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            Diagnostic Quiz Verification
          </h3>

          <div className="space-y-3">
            {gapsData.quizzes.map((q) => {
              const isVerified = quizResults[q.id] !== undefined;
              const res = quizResults[q.id];

              return (
                <div key={q.id} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <span className="font-bold text-white leading-snug block">{q.question}</span>
                  
                  <div className="space-y-1.5">
                    {q.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => !isVerified && handleOptionSelect(q.id, oIdx)}
                        className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                          selectedAnswers[q.id] === oIdx
                            ? 'bg-indigo-600/30 border-indigo-400 text-white font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {isVerified ? (
                    <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-medium">
                      ✓ {res.explanation}
                    </div>
                  ) : (
                    <button
                      onClick={() => verifyQuiz(q.id)}
                      disabled={selectedAnswers[q.id] === undefined}
                      className="w-full py-2 rounded-lg bg-indigo-600 text-white font-bold disabled:opacity-40"
                    >
                      Verify Recall
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
