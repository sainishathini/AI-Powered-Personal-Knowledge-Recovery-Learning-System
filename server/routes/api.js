const express = require('express');
const router = express.Router();
const store = require('../models/store');
const { extractConceptsFromMaterial, recoverKnowledgeOrigin } = require('../services/aiEngine');

// 1. Get Workspace Summary & Stats
router.get('/workspace/summary', (req, res) => {
  res.json(store.getWorkspaceSummary());
});

// 2. Switch Demo Workspace (Presentation Demo Switcher)
router.post('/workspace/switch', (req, res) => {
  const { workspaceId } = req.body;
  store.resetWorkspace(workspaceId || 'aiml');
  res.json({
    message: `Switched workspace to ${workspaceId}`,
    summary: store.getWorkspaceSummary()
  });
});

// 3. Get All Learning Materials
router.get('/materials', (req, res) => {
  res.json(store.getAllMaterials());
});

// 4. Upload / Create New Learning Material & Auto-Analyze Concepts
router.post('/materials/upload', async (req, res) => {
  try {
    const { title, content, type, course, author } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }

    // Save material to store
    const newDoc = store.addMaterial({ title, content, type, course, author });

    // AI Concept Extraction
    const extractionResult = await extractConceptsFromMaterial(newDoc.title, newDoc.content);
    
    // Support both direct array and result object
    const rawConcepts = Array.isArray(extractionResult) ? extractionResult : (extractionResult.concepts || []);
    const keywords = extractionResult.keywords || rawConcepts.map(c => c.title);
    const summaryText = extractionResult.summary || `Indexed ${rawConcepts.length} concepts from ${newDoc.title}.`;
    const relatedConcepts = extractionResult.relatedConcepts || [...new Set(rawConcepts.flatMap(c => c.connectedConcepts || []))];

    // Formally attach source doc ID to concepts
    const formattedConcepts = rawConcepts.map(c => ({
      ...c,
      sourceDocId: newDoc.id,
      sourceDocTitle: newDoc.title
    }));

    store.addConcepts(formattedConcepts);

    res.json({
      message: 'Material ingested and concepts mapped successfully!',
      material: newDoc,
      extractedCount: formattedConcepts.length,
      concepts: formattedConcepts,
      keywords,
      summary: summaryText,
      relatedConcepts,
      sourceInfo: extractionResult.sourceInfo || {
        title: newDoc.title,
        type: newDoc.type,
        size: newDoc.size,
        dateExtracted: newDoc.dateAdded
      }
    });
  } catch (err) {
    console.error('Error in material upload:', err);
    res.status(500).json({ error: 'Failed to process material.' });
  }
});

// 5. Get All Concepts
router.get('/concepts', (req, res) => {
  res.json(store.getAllConcepts());
});

// 6. Get Knowledge Graph Nodes & Edges
router.get('/graph', (req, res) => {
  res.json(store.getKnowledgeGraph());
});

// 7. Core Flagship Feature: "Where did I learn this?" Knowledge Recovery API
router.post('/search/recover', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required.' });
    }

    const recoveryResult = await recoverKnowledgeOrigin(query);
    res.json(recoveryResult);
  } catch (err) {
    console.error('Error in knowledge recovery search:', err);
    res.status(500).json({ error: 'Failed to execute knowledge recovery.' });
  }
});

// 8. Get Learning Gaps and Diagnostic Quizzes
router.get('/gaps', (req, res) => {
  res.json(store.getGapsAndQuizzes());
});

// 9. Verify Quiz Answer
router.post('/gaps/quiz/verify', (req, res) => {
  const { quizId, selectedOption } = req.body;
  const { quizzes } = store.getGapsAndQuizzes();
  const quiz = quizzes.find(q => q.id === quizId);

  if (!quiz) {
    return res.status(404).json({ error: 'Quiz question not found.' });
  }

  const isCorrect = quiz.correctAnswer === selectedOption;
  res.json({
    quizId,
    isCorrect,
    correctAnswerIndex: quiz.correctAnswer,
    explanation: quiz.explanation
  });
});

module.exports = router;
