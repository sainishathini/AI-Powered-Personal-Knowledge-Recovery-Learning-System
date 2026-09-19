import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AddKnowledge from './components/AddKnowledge';
import SearchRecovery from './components/SearchRecovery';
import KnowledgeGraph from './components/KnowledgeGraph';
import ConceptExplorer from './components/ConceptExplorer';
import MaterialsList from './components/MaterialsList';
import UploadModal from './components/UploadModal';
import LoginModal from './components/LoginModal';
import GapAnalyzer from './components/GapAnalyzer';
import Flashcards from './components/Flashcards';
import ConceptDrawer from './components/ConceptDrawer';
import DemoControllerBar from './components/DemoControllerBar';

export default function App() {
  const [viewMode, setViewMode] = useState('app'); // 'landing' or 'app'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [summary, setSummary] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [user, setUser] = useState({ id: 'u-1', name: 'Alex Rivera', email: 'demo@memorymap.com', role: 'CS Student' });
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [currentDomain, setCurrentDomain] = useState('aiml');
  const [demoSearchQuery, setDemoSearchQuery] = useState('');

  useEffect(() => {
    fetchSummary();
    fetchHealth();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/workspace/summary');
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    }
  };

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthStatus(data);
    } catch (err) {
      console.error('Failed to fetch health:', err);
    }
  };

  const handleSwitchWorkspace = async (workspaceId) => {
    try {
      const res = await fetch('/api/workspace/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId })
      });
      const data = await res.json();
      setSummary(data.summary);
      setCurrentDomain(workspaceId);
    } catch (err) {
      console.error('Failed to switch workspace:', err);
    }
  };

  // Render Landing Page if viewMode === 'landing'
  if (viewMode === 'landing') {
    return (
      <LandingPage
        onExplore={(tab = 'dashboard') => {
          setActiveTab(tab);
          setViewMode('app');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex bg-[#07090e] font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* SaaS Left Sidebar Navigation (Desktop) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        onToggleLanding={() => setViewMode('landing')}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
        
        {/* Top Header Navigation */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          summary={summary}
          onSwitchWorkspace={handleSwitchWorkspace}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenLogin={() => setIsLoginOpen(true)}
          user={user}
          healthStatus={healthStatus}
          isDemoMode={isDemoMode}
          onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 pb-24">
          {activeTab === 'dashboard' && (
            <Dashboard
              summary={summary}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenUpload={() => setIsUploadOpen(true)}
            />
          )}

          {activeTab === 'add_knowledge' && (
            <AddKnowledge
              onNavigate={(tab) => setActiveTab(tab)}
              onRefresh={() => fetchSummary()}
            />
          )}

          {activeTab === 'search' && (
            <SearchRecovery
              currentDomain={currentDomain}
              initialQuery={demoSearchQuery}
              onSelectConcept={(concept) => setSelectedConcept(concept)}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'graph' && (
            <KnowledgeGraph
              onSelectConcept={(concept) => setSelectedConcept(concept)}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'explorer' && (
            <ConceptExplorer
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'materials' && (
            <MaterialsList
              onOpenUpload={() => setIsUploadOpen(true)}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'gaps' && (
            <GapAnalyzer
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'flashcards' && (
            <Flashcards />
          )}

          {activeTab === 'settings' && (
            <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-4 max-w-2xl mx-auto text-slate-300 text-xs">
              <h2 className="text-xl font-bold text-white">MemoryMap System Settings</h2>
              <div className="space-y-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center">
                  <span>AI Model Integration:</span>
                  <span className="font-bold text-emerald-400">Presentation Fallback Engine</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Vector Embedding Store:</span>
                  <span className="font-bold text-indigo-300">Local High-Dimensional Index</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Active User Account:</span>
                  <span className="font-bold text-cyan-300">{user?.name} ({user?.email})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Preloaded Knowledge Domains:</span>
                  <span className="font-bold text-purple-300">Java Collections, Data Structures, DBMS, Deep Learning</span>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 py-4 text-center text-xs text-slate-500 glass-panel">
          MemoryMap — AI-Powered Personal Knowledge Recovery & Learning System • Presentation Prototype
        </footer>

      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onRefresh={() => {
          fetchSummary();
        }}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(loggedUser) => setUser(loggedUser)}
      />

      {/* Concept Drawer */}
      <ConceptDrawer
        concept={selectedConcept}
        onClose={() => setSelectedConcept(null)}
      />

      {/* Competition Demo Mode Controller Bar */}
      {isDemoMode && (
        <DemoControllerBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onRunDemoQuery={(query) => {
            setDemoSearchQuery(query);
            setActiveTab('search');
          }}
          onClose={() => setIsDemoMode(false)}
        />
      )}

    </div>
  );
}
