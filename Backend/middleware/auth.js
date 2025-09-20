// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const config = require('../config'); // <-- 1. IMPORT THE CONFIG FILE

function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  // --- DEBUGGING LINES ---
  console.log('--- MIDDLEWARE: VERIFYING TOKEN ---');
  console.log('SECRET KEY USED:', config.jwt.secret);
  console.log('TOKEN RECEIVED:', token);
  // --- END DEBUGGING ---

  // 2. USE THE CORRECT SECRET FROM THE CONFIG FILE
  jwt.verify(token, config.jwt.secret, (err, user) => {
    if (err) {
      console.error('TOKEN VERIFICATION FAILED:', err.message);
      console.log('---------------------------\n');
      return res.sendStatus(403); // Forbidden (invalid token)
    }
    
    console.log('TOKEN VERIFIED SUCCESSFULLY');
    console.log('---------------------------\n');
    req.user = user;
    next();
  });
}

// authorize function remains the same
function authorize(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.sendStatus(403);
    }
    const hasRole = allowedRoles.includes(req.user.role);
    if (hasRole) {
      next();
    } else {
      res.sendStatus(403);
    }
  };
}

module.exports = {
  authenticate,
  authorize,
};