function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // For demo convenience, pass through if no token, or validate demo token
    req.user = { id: 'u-1', name: 'Alex Rivera', email: 'demo@memorymap.com' };
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (token === 'demo-jwt-token-memorymap-2026' || token) {
    req.user = { id: 'u-1', name: 'Alex Rivera', email: 'demo@memorymap.com' };
    return next();
  }

  res.status(401).json({ success: false, error: 'Unauthorized token' });
}

module.exports = authMiddleware;
