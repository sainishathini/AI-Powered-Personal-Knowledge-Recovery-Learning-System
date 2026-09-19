import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, XCircle, HelpCircle, BookOpen, Sparkles, TrendingUp, Award, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function GapAnalyzer() {
  const [gapsData, setGapsData] = useState({ gaps: [], quizzes: [] });
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResults, setQuizResults] = useState({});

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
    { name: 'Optimization', mastery: 85, color: '#6366f1' },
    { name: 'Attention', mastery: 68, color: '#8b5cf6' },
    { name: 'Encodings', mastery: 40, color: '#f59e0b' },
    { name: 'Activations', mastery: 72, color: '#06b6d4' },
    { name: 'Architectures', mastery: 92, color: '#10b981' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Overview Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 bg-amber-950/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-sans">Learning Gap & Mastery Diagnostic</h2>
            <p className="text-xs text-slate-400">
              AI identifies isolated concepts, weak prerequisite links, and forgotten sources.
            </p>
          </div>
        </div>

        <button
          onClick={fetchGaps}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold border border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Diagnostic</span>
        </button>
      </div>

      {/* Grid: Recharts Mastery Breakdown & Critical Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recharts Mastery Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Category Recall Mastery Distribution
            </h3>
            <span className="text-[11px] text-slate-400 font-semibold">Target: &gt;80%</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#6366f1', borderRadius: '8px', fontSize: '12px' }} 
                />
                <Bar dataKey="mastery" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.mastery < 50 ? '#ef4444' : entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Critical Gaps List */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Detected Knowledge Gaps & Unlinked Prerequisites
          </h3>

          <div className="space-y-3">
            {gapsData.gaps.map((gap) => (
              <div
                key={gap.id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-amber-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{gap.topic}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    gap.status === 'CRITICAL_GAP' 
                      ? 'bg-red-500/20 text-red-300 border-red-500/30' 
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {gap.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{gap.description}</p>

                <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] gap-2">
                  <span className="text-amber-300 font-semibold flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" /> Source: {gap.recommendedDoc}
                  </span>
                  <span className="text-slate-400 font-medium">Missing: {gap.missingPrerequisite}</span>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Interactive AI Diagnostic Quiz Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-indigo-500/30 space-y-6">
        
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Knowledge Recovery Verification Quizzes</h3>
            <p className="text-xs text-slate-400">Test your recall of source origins and conceptual definitions.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gapsData.quizzes.map((q) => {
            const isVerified = quizResults[q.id] !== undefined;
            const res = quizResults[q.id];

            return (
              <div
                key={q.id}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between"
              >
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-indigo-400 font-bold uppercase tracking-wider">
                    <span>Question {q.id}</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>

                  <h4 className="text-sm font-bold text-white font-sans leading-snug">
                    {q.question}
                  </h4>

                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[q.id] === optIdx;

                      return (
                        <button
                          key={optIdx}
                          onClick={() => !isVerified && handleOptionSelect(q.id, optIdx)}
                          className={`w-full text-left p-3 rounded-lg text-xs font-medium transition-all border ${
                            isSelected
                              ? 'bg-indigo-600/30 border-indigo-400 text-white font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] flex items-center justify-center font-mono shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Verification result feedback */}
                <div className="pt-3 border-t border-white/10 space-y-3">
                  {isVerified ? (
                    <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                      res.isCorrect 
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
                        : 'bg-red-950/60 border-red-500/40 text-red-300'
                    }`}>
                      <div className="flex items-center gap-1.5 font-bold">
                        {res.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                        <span>{res.isCorrect ? 'Correct Origin Citation!' : 'Incorrect Choice'}</span>
                      </div>
                      <p className="text-[11px] text-slate-300">{res.explanation}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => verifyQuiz(q.id)}
                      disabled={selectedAnswers[q.id] === undefined}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all disabled:opacity-40"
                    >
                      Verify Recall Answer
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
