const store = require('../models/store');

exports.login = (req, res) => {
  const { email, password } = req.body;
  if ((email === 'demo@memorymap.com' && password === 'demo123') || email) {
    return res.json({
      success: true,
      message: 'Login successful',
      token: 'demo-jwt-token-memorymap-2026',
      user: {
        id: 'u-1',
        name: 'Alex Rivera',
        email: email || 'demo@memorymap.com',
        role: 'CS Student'
      }
    });
  }
  res.status(401).json({ success: false, error: 'Invalid email or password' });
};

exports.register = (req, res) => {
  const { name, email } = req.body;
  res.json({
    success: true,
    message: 'User registered successfully',
    user: { id: `u-${Date.now()}`, name: name || 'Demo User', email: email || 'user@memorymap.com' }
  });
};
