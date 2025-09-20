// src/middleware/auth.js
const jwt = require('jsonwebtoken');

// Middleware to check if the user is logged in
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden (invalid token)
    }
    req.user = user; // Attach user payload to the request object
    next();
  });
}

// Middleware to check if the user has a specific role (e.g., 'admin')
function authorize(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.sendStatus(403); // Forbidden
    }

    const hasRole = allowedRoles.includes(req.user.role);
    if (hasRole) {
      next(); // Role is allowed, proceed to the next function
    } else {
      res.sendStatus(403); // Forbidden
    }
  };
}

module.exports = {
  authenticate,
  authorize,
};