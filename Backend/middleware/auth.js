const jwt = require('jsonwebtoken');
const config = require('../config');
// ❌ REMOVE this line: const db = require('../models');

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    
    // ✅ Get the initialized User model from the request object
    const { User } = req.models;
    
    // Now User.findByPk is a function
    const user = await User.findByPk(payload.id);
    
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    
    req.user = user; // attach the full user instance to the request
    next();
  } catch (err) {
    // The error message here can be improved for clarity
    console.error("Authentication error:", err.message);
    // "Invalid token" is a good generic message to send back to the client
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden: admin only' });
  next();
}

module.exports = { authenticate, requireAdmin };