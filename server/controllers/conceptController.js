const store = require('../models/store');

exports.getConcepts = (req, res) => {
  res.json(store.getAllConcepts());
};

exports.getConceptById = (req, res) => {
  const concepts = store.getAllConcepts();
  const c = concepts.find(item => item.id === req.params.id || item.title.toLowerCase() === req.params.id.toLowerCase());
  if (!c) return res.status(404).json({ error: 'Concept not found' });
  res.json(c);
};
