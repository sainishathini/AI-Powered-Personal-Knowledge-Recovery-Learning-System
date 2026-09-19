const { WORKSPACES } = require('../data/sampleData');

class MemoryStore {
  constructor() {
    this.currentWorkspaceId = 'aiml';
    this.resetWorkspace('aiml');
  }

  resetWorkspace(workspaceId = 'aiml') {
    const raw = WORKSPACES[workspaceId] || WORKSPACES.aiml;
    this.currentWorkspaceId = raw.id;
    this.workspaceInfo = {
      id: raw.id,
      name: raw.name,
      description: raw.description
    };
    this.materials = JSON.parse(JSON.stringify(raw.materials || []));
    this.concepts = JSON.parse(JSON.stringify(raw.concepts || []));
    this.relationships = JSON.parse(JSON.stringify(raw.relationships || []));
    this.gaps = JSON.parse(JSON.stringify(raw.gaps || []));
    this.quizzes = JSON.parse(JSON.stringify(raw.quizzes || []));
    this.recentSearches = JSON.parse(JSON.stringify(raw.recentSearches || []));
    this.suggestedTopics = JSON.parse(JSON.stringify(raw.suggestedTopics || []));
  }

  getWorkspaceSummary() {
    return {
      info: this.workspaceInfo,
      stats: {
        totalMaterials: this.materials.length,
        totalConcepts: this.concepts.length,
        totalRelationships: this.relationships.length,
        criticalGapsCount: this.gaps.length,
        averageMastery: Math.round(
          this.concepts.reduce((acc, c) => acc + (c.mastery || 50), 0) / (this.concepts.length || 1)
        )
      },
      recentMaterials: this.materials.slice(0, 4),
      recentSearches: this.recentSearches.slice(0, 5),
      suggestedTopics: this.suggestedTopics
    };
  }

  addRecentSearch(query, matchTitle, confidence = '98%') {
    this.recentSearches.unshift({
      query,
      timestamp: 'Just now',
      match: matchTitle,
      confidence
    });
    if (this.recentSearches.length > 8) {
      this.recentSearches.pop();
    }
  }

  getAllMaterials() {
    return this.materials;
  }

  addMaterial(material) {
    const newDoc = {
      id: `doc-${Date.now()}`,
      title: material.title,
      type: material.type || 'PDF',
      course: material.course || 'Personal Learning',
      author: material.author || 'User Upload',
      dateAdded: new Date().toISOString().split('T')[0],
      pageCount: material.pageCount || Math.floor(Math.random() * 20) + 5,
      size: material.size || '1.2 MB',
      content: material.content || ''
    };
    this.materials.unshift(newDoc);
    return newDoc;
  }

  getAllConcepts() {
    return this.concepts;
  }

  addConcepts(newConcepts) {
    newConcepts.forEach(c => {
      const exists = this.concepts.find(existing => existing.title.toLowerCase() === c.title.toLowerCase());
      if (!exists) {
        this.concepts.push({
          id: `c-${Date.now()}-${Math.floor(Math.random()*1000)}`,
          mastery: Math.floor(Math.random() * 40) + 50,
          confidence: 0.95,
          ...c
        });
      }
    });
  }

  addRelationships(newRel) {
    newRel.forEach(r => {
      this.relationships.push(r);
    });
  }

  getKnowledgeGraph() {
    const nodes = [];
    const edges = [];

    this.materials.forEach(doc => {
      nodes.push({
        id: doc.id,
        type: 'documentNode',
        data: {
          label: doc.title,
          type: doc.type,
          course: doc.course,
          pageCount: doc.pageCount,
          kind: 'document'
        },
        position: { x: Math.random() * 600, y: Math.random() * 400 }
      });
    });

    this.concepts.forEach(c => {
      nodes.push({
        id: c.id,
        type: 'conceptNode',
        data: {
          label: c.title,
          category: c.category,
          definition: c.definition,
          mastery: c.mastery,
          confidence: c.confidence,
          sourceDocId: c.sourceDocId,
          sourceDocTitle: c.sourceDocTitle,
          location: c.location,
          snippet: c.snippet,
          prerequisites: c.prerequisites,
          connectedConcepts: c.connectedConcepts,
          kind: 'concept'
        },
        position: { x: Math.random() * 700 + 100, y: Math.random() * 500 + 100 }
      });

      if (c.sourceDocId) {
        edges.push({
          id: `edge-${c.sourceDocId}-${c.id}`,
          source: c.sourceDocId,
          target: c.id,
          label: 'EXTRACTED_FROM',
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 }
        });
      }
    });

    this.relationships.forEach((rel, idx) => {
      edges.push({
        id: `rel-${idx}-${rel.source}-${rel.target}`,
        source: rel.source,
        target: rel.target,
        label: rel.label || rel.type,
        type: 'smoothstep',
        style: { stroke: '#a855f7', strokeDasharray: '5 5', strokeWidth: 1.5 }
      });
    });

    return { nodes, edges };
  }

  getGapsAndQuizzes() {
    return {
      gaps: this.gaps,
      quizzes: this.quizzes
    };
  }
}

const storeInstance = new MemoryStore();
module.exports = storeInstance;
