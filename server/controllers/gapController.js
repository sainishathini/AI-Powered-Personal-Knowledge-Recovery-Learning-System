const store = require('../models/store');

exports.getLearningGaps = (req, res) => {
  res.json(store.getGapsAndQuizzes());
};
