const mongoose = require('mongoose');

// 1. User Model Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// 2. Resource Model Schema
const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, default: 'PDF' },
  content: { type: String, required: true },
  source: { type: String, default: 'Upload' },
  course: { type: String, default: 'CS Curriculum' },
  author: { type: String, default: 'Instructor' },
  pageCount: { type: Number, default: 10 },
  concepts: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

// 3. Concept Model Schema
const ConceptSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'General' },
  resources: [{
    doc: String,
    location: String
  }],
  relatedConcepts: [{ type: String }],
  learningStatus: { type: String, default: 'Intermediate' },
  mastery: { type: Number, default: 80 }
});

// 4. KnowledgeRelation Schema
const KnowledgeRelationSchema = new mongoose.Schema({
  sourceConcept: { type: String, required: true },
  targetConcept: { type: String, required: true },
  relationship: { type: String, required: true }
});

// 5. LearningGap Schema
const LearningGapSchema = new mongoose.Schema({
  concept: { type: String, required: true },
  missingTopics: [{ type: String }],
  progress: { type: Number, default: 50 },
  suggestedNextTopic: { type: String, required: true }
});

// Export models (checking if model already exists to prevent overwrite errors)
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Resource = mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);
const Concept = mongoose.models.Concept || mongoose.model('Concept', ConceptSchema);
const KnowledgeRelation = mongoose.models.KnowledgeRelation || mongoose.model('KnowledgeRelation', KnowledgeRelationSchema);
const LearningGap = mongoose.models.LearningGap || mongoose.model('LearningGap', LearningGapSchema);

module.exports = {
  User,
  Resource,
  Concept,
  KnowledgeRelation,
  LearningGap
};
