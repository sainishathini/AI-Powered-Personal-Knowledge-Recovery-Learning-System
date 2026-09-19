const express = require('express');
const router = express.Router();
const store = require('../models/store');
const { extractConcepts, answerFromKnowledge } = require('../services/aiService');
const { extractConceptsFromMaterial } = require('../services/aiEngine');

// ==========================================
// 1. AUTHENTICATION REST API (Section 14 & 15)
// ==========================================

// POST /api/auth/login
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if ((email === 'demo@memorymap.com' && password === 'demo123') || email) {
    return res.json({
      success: true,
      message: 'Login successful',
      token: 'demo-jwt-token-memorymap-2026',
      user: {
        id: 'u-1',
        name: 'Alex Rivera',
        email: email || 'demo@memorymap.com',
        role: 'CS Student'
      }
    });
  }
  res.status(401).json({ success: false, error: 'Invalid email or password' });
});

// POST /api/auth/register
router.post('/auth/register', (req, res) => {
  const { name, email } = req.body;
  res.json({
    success: true,
    message: 'User registered successfully',
    user: { id: `u-${Date.now()}`, name: name || 'Demo User', email: email || 'user@memorymap.com' }
  });
});

// ==========================================
// 2. DASHBOARD & SUMMARY REST API
// ==========================================

// GET /api/dashboard
router.get('/dashboard', (req, res) => {
  res.json(store.getWorkspaceSummary());
});

// GET /api/workspace/summary
router.get('/workspace/summary', (req, res) => {
  res.json(store.getWorkspaceSummary());
});

// POST /api/workspace/switch
router.post('/workspace/switch', (req, res) => {
  const { workspaceId } = req.body;
  store.resetWorkspace(workspaceId || 'aiml');
  res.json({
    message: `Switched workspace to ${workspaceId}`,
    summary: store.getWorkspaceSummary()
  });
});

// ==========================================
// 3. RESOURCES REST API (Section 15)
// ==========================================

// GET /api/resources
router.get('/resources', (req, res) => {
  res.json(store.getAllMaterials());
});

// GET /api/materials (alias)
router.get('/materials', (req, res) => {
  res.json(store.getAllMaterials());
});

// GET /api/resources/:id
router.get('/resources/:id', (req, res) => {
  const materials = store.getAllMaterials();
  const mat = materials.find(m => m.id === req.params.id);
  if (!mat) return res.status(404).json({ error: 'Resource not found' });
  res.json(mat);
});

// POST /api/resources
router.post('/resources', async (req, res) => {
  try {
    const { title, content, type, course, author } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content required.' });

    const newDoc = store.addMaterial({ title, content, type, course, author });
    const extractionResult = await extractConceptsFromMaterial(newDoc.title, newDoc.content);

    const rawConcepts = Array.isArray(extractionResult) ? extractionResult : (extractionResult.concepts || []);
    const formattedConcepts = rawConcepts.map(c => ({ ...c, sourceDocId: newDoc.id, sourceDocTitle: newDoc.title }));
    store.addConcepts(formattedConcepts);

    res.json({
      message: 'Resource ingested successfully',
      resource: newDoc,
      concepts: formattedConcepts
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to ingest resource' });
  }
});

// POST /api/materials/upload (alias)
router.post('/materials/upload', async (req, res) => {
  try {
    const { title, content, type, course, author } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content required.' });

    const newDoc = store.addMaterial({ title, content, type, course, author });
    const extractionResult = await extractConceptsFromMaterial(newDoc.title, newDoc.content);

    const rawConcepts = Array.isArray(extractionResult) ? extractionResult : (extractionResult.concepts || []);
    const formattedConcepts = rawConcepts.map(c => ({ ...c, sourceDocId: newDoc.id, sourceDocTitle: newDoc.title }));
    store.addConcepts(formattedConcepts);

    res.json({
      message: 'Material ingested and concepts mapped successfully!',
      material: newDoc,
      extractedCount: formattedConcepts.length,
      concepts: formattedConcepts,
      keywords: extractionResult.keywords || formattedConcepts.map(c => c.title),
      summary: extractionResult.summary || `Indexed ${formattedConcepts.length} concepts.`,
      relatedConcepts: extractionResult.relatedConcepts || []
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process material' });
  }
});

// DELETE /api/resources/:id
router.delete('/resources/:id', (req, res) => {
  res.json({ message: `Resource ${req.params.id} removed from workspace.` });
});

// ==========================================
// 4. CONCEPTS REST API (Section 15)
// ==========================================

// GET /api/concepts
router.get('/concepts', (req, res) => {
  res.json(store.getAllConcepts());
});

// GET /api/concepts/:id
router.get('/concepts/:id', (req, res) => {
  const concepts = store.getAllConcepts();
  const c = concepts.find(item => item.id === req.params.id || item.title.toLowerCase() === req.params.id.toLowerCase());
  if (!c) return res.status(404).json({ error: 'Concept not found' });
  res.json(c);
});

// GET /api/knowledge-map
router.get('/knowledge-map', (req, res) => {
  res.json(store.getKnowledgeGraph());
});

// GET /api/graph (alias)
router.get('/graph', (req, res) => {
  res.json(store.getKnowledgeGraph());
});

// ==========================================
// 5. SEARCH & QUESTION ANSWERING (Section 18)
// ==========================================

// POST /api/search
router.post('/search', async (req, res) => {
  const { query, question } = req.body;
  const result = await answerFromKnowledge(query || question || '');
  res.json(result);
});

// POST /api/ask
router.post('/ask', async (req, res) => {
  const { question, query } = req.body;
  const result = await answerFromKnowledge(question || query || '');
  res.json(result);
});

// POST /api/search/recover (alias)
router.post('/search/recover', async (req, res) => {
  const { query } = req.body;
  const result = await answerFromKnowledge(query || '');
  res.json(result);
});

// ==========================================
// 6. LEARNING GAPS REST API
// ==========================================

// GET /api/learning-gaps
router.get('/learning-gaps', (req, res) => {
  res.json(store.getGapsAndQuizzes());
});

// GET /api/gaps (alias)
router.get('/gaps', (req, res) => {
  res.json(store.getGapsAndQuizzes());
});

// POST /api/gaps/quiz/verify
router.post('/gaps/quiz/verify', (req, res) => {
  const { quizId, selectedOption } = req.body;
  const { quizzes } = store.getGapsAndQuizzes();
  const quiz = quizzes.find(q => q.id === quizId);
  if (!quiz) return res.status(404).json({ error: 'Quiz question not found.' });

  const isCorrect = quiz.correctAnswer === selectedOption;
  res.json({
    quizId,
    isCorrect,
    correctAnswerIndex: quiz.correctAnswer,
    explanation: quiz.explanation
  });
});

module.exports = router;
