const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, default: 'PDF' },
  content: { type: String, required: true },
  source: { type: String, default: 'Upload' },
  createdAt: { type: Date, default: Date.now },
  concepts: [{ type: String }]
});

module.exports = mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);
