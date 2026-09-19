const store = require('../models/store');

exports.getKnowledgeMap = (req, res) => {
  res.json(store.getKnowledgeGraph());
};
