const mongoose = require('mongoose');

const LearningGapSchema = new mongoose.Schema({
  concept: { type: String, required: true },
  missingTopics: [{ type: String }],
  progress: { type: Number, default: 50 },
  suggestedNextTopic: { type: String, required: true }
});

module.exports = mongoose.models.LearningGap || mongoose.model('LearningGap', LearningGapSchema);
