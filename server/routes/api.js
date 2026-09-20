const express = require('express');
const router = express.Router();
const store = require('../models/store');
const { extractConcepts, answerFromKnowledge } = require('../services/aiService');
const { extractConceptsFromMaterial } = require('../services/aiEngine');
const driveService = require('../services/googleDriveService');
const processors = require('../services/contentProcessors');
const presentationService = require('../services/presentationService');

// ==========================================
// GOOGLE DRIVE OAUTH & INGESTION REST API
// ==========================================

// GET /api/auth/google/url - Get Google OAuth Auth URL
router.get('/auth/google/url', (req, res) => {
  res.json({ url: driveService.getGoogleAuthUrl() });
});

// POST /api/auth/google/connect - Connect Google Drive Session
router.post('/auth/google/connect', (req, res) => {
  const session = driveService.connectGoogleDrive(req.body);
  res.json({ success: true, session });
});

// GET /api/auth/google/demo-callback - Demo callback helper
router.get('/auth/google/demo-callback', (req, res) => {
  const session = driveService.connectGoogleDrive();
  res.json({ success: true, message: 'Google Drive connected successfully!', session });
});

// GET /api/drive/status - Get Drive connection status
router.get('/drive/status', (req, res) => {
  res.json(driveService.getDriveStatus());
});

// POST /api/drive/disconnect - Disconnect Google Drive (Section 17)
router.post('/drive/disconnect', (req, res) => {
  const result = driveService.disconnectGoogleDrive();
  res.json(result);
});

// POST /api/drive/auto-sync - Toggle automatic sync setting (Section 16)
router.post('/drive/auto-sync', (req, res) => {
  const { enabled } = req.body;
  const session = driveService.setAutoSync(enabled);
  res.json({ success: true, autoSync: session.autoSync, session });
});

// POST /api/drive/sync-now - Trigger immediate re-sync
router.post('/drive/sync-now', async (req, res) => {
  try {
    const { folderId } = req.body;
    const result = await driveService.ingestGoogleDriveFolder(folderId || 'folder-college-1');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to sync Google Drive folder' });
  }
});

// GET /api/drive/folders - List Google Drive learning folders
router.get('/drive/folders', (req, res) => {
  res.json(driveService.getDriveFolders());
});

// GET /api/drive/files - List files in folder
router.get('/drive/files', (req, res) => {
  const folderId = req.query.folderId || 'folder-college-1';
  res.json(driveService.getDriveFilesByFolderId(folderId));
});

// POST /api/drive/ingest-folder - Ingest permitted files from selected folder
router.post('/api/drive/ingest-folder', async (req, res) => {
  try {
    const { folderId } = req.body;
    const result = await driveService.ingestGoogleDriveFolder(folderId || 'folder-college-1');
    res.json(result);
  } catch (err) {
    console.error('Drive Ingestion Error:', err);
    res.status(500).json({ error: 'Failed to process Google Drive folder' });
  }
});

// POST /api/drive/ingest - Alias for folder ingestion
router.post('/drive/ingest', async (req, res) => {
  try {
    const { folderId } = req.body;
    const result = await driveService.ingestGoogleDriveFolder(folderId || 'folder-college-1');
    res.json(result);
  } catch (err) {
    console.error('Drive Ingestion Error:', err);
    res.status(500).json({ error: 'Failed to process Google Drive folder' });
  }
});


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
      message: 'Material uploaded and processed',
      material: newDoc,
      concepts: formattedConcepts
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload material' });
  }
});

// POST /api/materials/process-image - Process Image / OCR (Section 4)
router.post('/materials/process-image', async (req, res) => {
  try {
    const processed = await processors.processImage(req.body);
    const newDoc = store.addMaterial({
      title: req.body.title || 'DSA_Notes.jpg',
      content: processed.extractedText,
      type: 'Image',
      sourceType: 'image',
      course: req.body.course || 'Data Structures'
    });
    store.addConcepts(processed.concepts.map(c => ({ ...c, sourceDocId: newDoc.id, sourceDocTitle: newDoc.title })));
    res.json({ success: true, material: newDoc, ...processed });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process image OCR' });
  }
});

// POST /api/materials/process-video - Process Video Lecture (Section 5)
router.post('/materials/process-video', async (req, res) => {
  try {
    const processed = await processors.processVideo(req.body);
    const newDoc = store.addMaterial({
      title: req.body.title || 'DSA_Lecture.mp4',
      content: processed.transcript,
      type: 'Video',
      sourceType: 'video',
      course: req.body.course || 'Data Structures'
    });
    store.addConcepts(processed.concepts.map(c => ({ ...c, sourceDocId: newDoc.id, sourceDocTitle: newDoc.title })));
    res.json({ success: true, material: newDoc, ...processed });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process video transcript' });
  }
});

// POST /api/materials/process-youtube - Process YouTube Video URL (Section 6)
router.post('/materials/process-youtube', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({ error: 'Unable to analyze this video. Please check the URL or try another video.' });
    }

    const processed = await processors.processYouTube(req.body);
    const tLower = (processed.title || '').toLowerCase();
    const dynamicCourse = tLower.includes('python') 
      ? 'Python Programming' 
      : tLower.includes('dbms') || tLower.includes('database') 
        ? 'Database Systems' 
        : tLower.includes('machine learning') 
          ? 'Artificial Intelligence' 
          : 'General Computer Science';

    const newDoc = store.addMaterial({
      title: processed.title,
      content: processed.transcript,
      type: 'YouTube',
      sourceType: 'youtube',
      sourceUrl: processed.sourceUrl,
      course: dynamicCourse
    });
    store.addConcepts(processed.concepts.map(c => ({ ...c, sourceDocId: newDoc.id, sourceDocTitle: newDoc.title })));
    res.json({ success: true, material: newDoc, ...processed });
  } catch (err) {
    res.status(500).json({ error: 'Unable to analyze this video. Please check the URL or try another video.' });
  }
});

// POST /api/materials/process-note - Process Quick Text Note (Section 7)
router.post('/materials/process-note', async (req, res) => {
  try {
    const processed = await processors.processNote(req.body);
    const newDoc = store.addMaterial({
      title: req.body.title || 'My HashSet Notes',
      content: processed.extractedText,
      type: 'Notes',
      sourceType: 'note',
      course: 'Personal Notes'
    });
    store.addConcepts(processed.concepts.map(c => ({ ...c, sourceDocId: newDoc.id, sourceDocTitle: newDoc.title })));
    res.json({ success: true, material: newDoc, ...processed });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process note' });
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
// ==========================================
// 7. PRESENTATION AI REST API (Section 25)
// ==========================================

// POST /api/presentations/generate - Generate Presentation & .pptx File
router.post('/presentations/generate', async (req, res) => {
  try {
    const { topic, type, slideCount, resourceIds, language, initialQuery } = req.body;
    const presentation = await presentationService.generatePresentation({
      topic,
      type,
      slideCount,
      resourceIds,
      language,
      initialQuery
    });
    res.json({ success: true, presentation });
  } catch (err) {
    console.error('Presentation AI Generation Error:', err);
    res.status(500).json({ error: 'Failed to generate presentation PowerPoint file.' });
  }
});

// GET /api/presentations - List Presentations
router.get('/presentations', (req, res) => {
  res.json(store.getAllPresentations());
});

// GET /api/presentations/:id - Get Single Presentation
router.get('/presentations/:id', (req, res) => {
  const pres = store.getPresentationById(req.params.id);
  if (!pres) return res.status(404).json({ error: 'Presentation not found.' });
  res.json(pres);
});

// PUT /api/presentations/:id - Update Slide Text & Regenerate PPTX
router.put('/presentations/:id', async (req, res) => {
  try {
    const updated = await presentationService.updatePresentation(req.params.id, req.body.slides);
    if (!updated) return res.status(404).json({ error: 'Presentation not found.' });
    res.json({ success: true, presentation: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update presentation.' });
  }
});

// GET /api/presentations/:id/download - Download Real .pptx File
router.get('/presentations/:id/download', (req, res) => {
  const pres = store.getPresentationById(req.params.id);
  if (!pres || !pres.filePath) {
    return res.status(404).json({ error: 'Presentation file not found.' });
  }

  const fs = require('fs');
  if (!fs.existsSync(pres.filePath)) {
    return res.status(404).json({ error: 'PPTX file does not exist on server filesystem.' });
  }

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
  res.download(pres.filePath, pres.fileName || 'Presentation.pptx');
});

module.exports = router;
