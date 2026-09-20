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
    this.recentRecoveredMemory = JSON.parse(JSON.stringify(raw.recentRecoveredMemory || []));
    this.presentations = [];
  }

  addPresentation(pres) {
    const idx = this.presentations.findIndex(p => p.id === pres.id);
    if (idx >= 0) {
      this.presentations[idx] = pres;
    } else {
      this.presentations.unshift(pres);
    }
    return pres;
  }

  getAllPresentations() {
    return this.presentations;
  }

  getPresentationById(id) {
    return this.presentations.find(p => p.id === id);
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
      recentMaterials: this.materials.slice(0, 6),
      recentSearches: this.recentSearches.slice(0, 5),
      suggestedTopics: this.suggestedTopics,
      recentRecoveredMemory: this.recentRecoveredMemory
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
    const existing = this.materials.find(m => 
      (material.id && m.id === material.id) ||
      (material.title && m.title && m.title.toLowerCase() === material.title.toLowerCase()) ||
      (material.sourceUrl && m.sourceUrl && m.sourceUrl === material.sourceUrl)
    );
    if (existing) {
      existing.content = material.content || existing.content;
      existing.status = 'Analyzed & Updated';
      return existing;
    }
    const newDoc = {
      id: material.id || `doc-${Date.now()}`,
      title: material.title,
      type: material.type || 'PDF',
      sourceType: material.sourceType || 'file_upload',
      sourceUrl: material.sourceUrl || 'Workspace Resource',
      course: material.course || 'Personal Learning',
      author: material.author || 'User Upload',
      dateAdded: new Date().toISOString().split('T')[0],
      pageCount: material.pageCount || Math.floor(Math.random() * 15) + 3,
      size: material.size || '1.2 MB',
      content: material.content || '',
      status: material.status || 'Indexed & Mapped'
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
          mastery: Math.floor(Math.random() * 30) + 65,
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

    if (this.materials.length === 0) {
      return { nodes: [], edges: [] };
    }

    // Process concepts grouped by resource or category to build a clean topology
    let currentX = 350;
    let currentY = 30;

    // 1. Group concepts by sourceDocTitle / sourceDocId
    const docGroups = {};
    this.concepts.forEach(c => {
      const key = c.sourceDocTitle || 'Primary Resource';
      if (!docGroups[key]) docGroups[key] = [];
      docGroups[key].push(c);
    });

    const docKeys = Object.keys(docGroups);
    const primaryDocTitle = docKeys[0] || (this.materials[0] && this.materials[0].title) || 'Learning Resource';
    const rootTitle = primaryDocTitle.replace(/\.[^/.]+$/, '').toUpperCase();

    // Create Root Domain Node
    const rootId = `root-domain-node`;
    nodes.push({
      id: rootId,
      conceptId: rootId,
      label: rootTitle,
      category: 'Root Domain',
      type: 'root',
      mastery: 92,
      definition: `Master concept domain extracted from ${primaryDocTitle}. Stores core principles, sub-topics, and indexed knowledge.`,
      snippet: `Primary root topic: ${rootTitle}`,
      sourceDocId: this.materials[0] ? this.materials[0].id : null,
      sourceDocTitle: primaryDocTitle,
      sourceType: primaryDocTitle.endsWith('.mp4') ? 'video' : primaryDocTitle.includes('YouTube') ? 'youtube' : 'file_upload',
      location: 'Overview',
      resourcesList: this.materials.map(m => ({ title: m.title, sourceType: m.sourceType, location: 'Indexed' })),
      resources: [primaryDocTitle],
      related: Object.keys(docGroups),
      status: 'MASTERED',
      nextTopic: 'Sub-Topic Analysis',
      x: 350,
      y: 30
    });

    // 2. Group concepts into Categories (Level 1) & Sub-concepts (Level 2)
    const primaryConcepts = docGroups[primaryDocTitle] || this.concepts;
    const categoryMap = {};

    primaryConcepts.forEach(c => {
      const catName = c.category || 'Core Concepts';
      if (!categoryMap[catName]) categoryMap[catName] = [];
      categoryMap[catName].push(c);
    });

    const categoryList = Object.keys(categoryMap);
    const catCols = Math.max(categoryList.length, 1);
    const catSpacing = Math.min(600 / catCols, 240);
    const catStartX = 350 - ((catCols - 1) * catSpacing) / 2;

    categoryList.forEach((catName, catIdx) => {
      const catId = `cat-node-${catIdx}`;
      const catX = Math.round(catStartX + catIdx * catSpacing);
      const catY = 150;

      // Category Sub-concept Node
      nodes.push({
        id: catId,
        conceptId: catId,
        label: catName.toUpperCase(),
        category: 'Sub-Domain',
        type: 'category',
        mastery: 88,
        definition: `Category sub-domain focusing on ${catName} principles extracted from ${primaryDocTitle}.`,
        snippet: `Main sub-topic: ${catName}`,
        sourceDocId: this.materials[0] ? this.materials[0].id : null,
        sourceDocTitle: primaryDocTitle,
        sourceType: primaryDocTitle.endsWith('.mp4') ? 'video' : primaryDocTitle.includes('YouTube') ? 'youtube' : 'file_upload',
        location: 'Section ' + (catIdx + 1),
        resourcesList: [{ title: primaryDocTitle, sourceType: 'file_upload', location: `Section ${catIdx + 1}` }],
        resources: [primaryDocTitle],
        related: categoryMap[catName].map(item => item.title),
        status: 'MASTERED',
        nextTopic: categoryMap[catName][0] ? categoryMap[catName][0].title : 'Next Concept',
        x: catX,
        y: catY
      });

      // Edge from Root -> Category Node
      edges.push({
        id: `edge-root-${catId}`,
        from: rootId,
        to: catId,
        label: 'INCLUDES'
      });

      // Child Concepts under this Category
      const childConcepts = categoryMap[catName];
      childConcepts.forEach((conceptItem, childIdx) => {
        const conceptX = Math.round(catX - ((childConcepts.length - 1) * 80) / 2 + childIdx * 90);
        const conceptY = 270 + Math.floor(childIdx / 2) * 90;

        const conceptNodeId = conceptItem.id || `concept-leaf-${catIdx}-${childIdx}`;
        nodes.push({
          id: conceptNodeId,
          conceptId: conceptItem.id || conceptNodeId,
          label: (conceptItem.title || 'Concept').toUpperCase(),
          category: catName,
          type: 'concept',
          mastery: conceptItem.mastery || 85,
          definition: conceptItem.definition || conceptItem.snippet || `Extracted concept details for ${conceptItem.title}.`,
          snippet: conceptItem.snippet || conceptItem.definition || '',
          sourceDocId: conceptItem.sourceDocId || (this.materials[0] ? this.materials[0].id : null),
          sourceDocTitle: conceptItem.sourceDocTitle || primaryDocTitle,
          sourceType: conceptItem.sourceType || (primaryDocTitle.endsWith('.mp4') ? 'video' : primaryDocTitle.includes('YouTube') ? 'youtube' : 'file_upload'),
          location: conceptItem.location || 'Section 1',
          resourcesList: [
            {
              title: conceptItem.sourceDocTitle || primaryDocTitle,
              sourceType: conceptItem.sourceType || 'file_upload',
              location: conceptItem.location || 'Indexed'
            }
          ],
          resources: [conceptItem.sourceDocTitle || primaryDocTitle],
          related: conceptItem.connectedConcepts || conceptItem.prerequisites || ['Related Topic'],
          status: (conceptItem.mastery && conceptItem.mastery < 60) ? 'NEEDS_REVIEW' : 'MASTERED',
          nextTopic: (conceptItem.connectedConcepts && conceptItem.connectedConcepts[0]) || 'Advanced Topic',
          x: Math.max(30, Math.min(680, conceptX)),
          y: conceptY
        });

        // Edge from Category -> Concept Node
        edges.push({
          id: `edge-${catId}-${conceptNodeId}`,
          from: catId,
          to: conceptNodeId,
          label: 'EXTRACTED_FROM'
        });
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
