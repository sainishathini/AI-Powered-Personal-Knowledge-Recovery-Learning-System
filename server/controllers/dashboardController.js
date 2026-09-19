const store = require('../models/store');

exports.getDashboard = (req, res) => {
  res.json(store.getWorkspaceSummary());
};
