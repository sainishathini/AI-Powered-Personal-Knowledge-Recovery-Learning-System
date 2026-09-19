const mongoose = require('mongoose');

const KnowledgeRelationSchema = new mongoose.Schema({
  sourceConcept: { type: String, required: true },
  targetConcept: { type: String, required: true },
  relationship: { type: String, required: true }
});

module.exports = mongoose.models.KnowledgeRelation || mongoose.model('KnowledgeRelation', KnowledgeRelationSchema);
