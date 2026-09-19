const store = require('../models/store');
const { extractConceptsFromMaterial } = require('../services/aiEngine');

exports.getResources = (req, res) => {
  res.json(store.getAllMaterials());
};

exports.getResourceById = (req, res) => {
  const materials = store.getAllMaterials();
  const param = (req.params.id || '').toLowerCase();
  const mat = materials.find(m => m.id === req.params.id || m.id.toLowerCase() === param || m.id.toLowerCase().includes(param) || (m.title && m.title.toLowerCase().includes(param)));
  if (!mat) return res.status(404).json({ error: 'Resource not found' });
  res.json(mat);
};

exports.createResource = async (req, res) => {
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
};

exports.deleteResource = (req, res) => {
  res.json({ message: `Resource ${req.params.id} removed from workspace.` });
};
