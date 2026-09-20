import React from 'react';
import { Brain, LayoutDashboard, Search, Network, BookOpen, Compass, AlertTriangle, Settings, User, PlusCircle, Sparkles, ChevronRight, Presentation } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onOpenUpload, onToggleLanding }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null, color: 'text-cyan-400' },
    { id: 'search', label: 'Ask My Knowledge', icon: Search, badge: 'AI', color: 'text-indigo-400' },
    { id: 'presentation_ai', label: 'Presentation AI', icon: Presentation, badge: 'PPTX', color: 'text-purple-400' },
    { id: 'graph', label: 'Knowledge Map', icon: Network, badge: null, color: 'text-purple-400' },
    { id: 'materials', label: 'Resources', icon: BookOpen, badge: null, color: 'text-cyan-400' },
    { id: 'explorer', label: 'Concept Explorer', icon: Compass, badge: null, color: 'text-blue-400' },
    { id: 'gaps', label: 'Learning Gaps', icon: AlertTriangle, badge: '75%', color: 'text-amber-400' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null, color: 'text-slate-400' },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-white/10 flex flex-col justify-between shrink-0 h-screen sticky top-0 hidden md:flex">
      
      <div className="p-5 space-y-6">
        
        {/* Brand Header */}
        <div 
          onClick={onToggleLanding}
          className="flex items-center gap-3 cursor-pointer group"
          title="Return to Landing Page"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider text-white font-sans uppercase">
              MEMORY<span className="text-indigo-400">MAP</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-tight">AI Knowledge Engine</p>
          </div>
        </div>

        {/* Add Knowledge Primary CTA */}
        <button
          onClick={() => setActiveTab('add_knowledge')}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Knowledge</span>
        </button>

        {/* Sidebar Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/40 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : item.color}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    item.badge === 'AI' 
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

      </div>

      {/* User Profile Footer Widget */}
      <div className="p-4 border-t border-white/10 bg-slate-950/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white text-xs border border-white/20">
                AR
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 absolute bottom-0 right-0" />
            </div>

            <div>
              <div className="text-xs font-bold text-white leading-none">Alex Rivera</div>
              <div className="text-[10px] text-slate-400">CS Student Account</div>
            </div>
          </div>

          <button
            onClick={onToggleLanding}
            className="text-[11px] text-slate-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5"
            title="Switch to Landing Page"
          >
            <span>Landing</span>
          </button>
        </div>
      </div>

    </aside>
  );
}
