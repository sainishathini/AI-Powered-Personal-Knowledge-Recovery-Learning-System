const { answerFromKnowledge } = require('../services/aiService');

exports.search = async (req, res) => {
  const { query, question } = req.body;
  const result = await answerFromKnowledge(query || question || '');
  res.json(result);
};

exports.ask = async (req, res) => {
  const { question, query } = req.body;
  const result = await answerFromKnowledge(question || query || '');
  res.json(result);
};
