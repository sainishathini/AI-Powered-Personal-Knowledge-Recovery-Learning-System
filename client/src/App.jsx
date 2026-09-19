import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchRecovery from './components/SearchRecovery';
import KnowledgeGraph from './components/KnowledgeGraph';
import MaterialsList from './components/MaterialsList';
import UploadModal from './components/UploadModal';
import GapAnalyzer from './components/GapAnalyzer';
import Flashcards from './components/Flashcards';
import ConceptDrawer from './components/ConceptDrawer';

export default function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [summary, setSummary] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [currentDomain, setCurrentDomain] = useState('aiml');

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

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        summary={summary}
        onSwitchWorkspace={handleSwitchWorkspace}
        onOpenUpload={() => setIsUploadOpen(true)}
        healthStatus={healthStatus}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {activeTab === 'search' && (
          <SearchRecovery
            currentDomain={currentDomain}
            onSelectConcept={(concept) => setSelectedConcept(concept)}
          />
        )}

        {activeTab === 'graph' && (
          <KnowledgeGraph
            onSelectConcept={(concept) => setSelectedConcept(concept)}
          />
        )}

        {activeTab === 'materials' && (
          <MaterialsList
            onOpenUpload={() => setIsUploadOpen(true)}
          />
        )}

        {activeTab === 'gaps' && (
          <GapAnalyzer />
        )}

        {activeTab === 'flashcards' && (
          <Flashcards />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-4 text-center text-xs text-slate-500 glass-panel">
        MemoryMap — AI-Powered Personal Knowledge Recovery & Learning System • Presentation Competition Prototype
      </footer>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onRefresh={() => {
          fetchSummary();
        }}
      />

      {/* Concept Drawer */}
      <ConceptDrawer
        concept={selectedConcept}
        onClose={() => setSelectedConcept(null)}
      />

    </div>
  );
}
