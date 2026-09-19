const mongoose = require('mongoose');

const ConceptSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  resources: [{
    doc: String,
    location: String
  }],
  relatedConcepts: [{ type: String }],
  learningStatus: { type: String, default: 'Intermediate' }
});

module.exports = mongoose.models.Concept || mongoose.model('Concept', ConceptSchema);
