const jwt = require('jsonwebtoken');
const config = require('../config');

async function register(req, res) {
  // ✅ Get the initialized User model from the request object
  const { User } = req.models;
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) return res.status(400).json({ message: 'name, email and password required' });
  
  try {
    // Now User.findOne is a function
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already registered' });
    
    const user = await User.create({ name, email, password, role: role === 'admin' ? 'admin' : 'user' });
    return res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function login(req, res) {
  // ✅ Get the initialized User model from the request object
  const { User } = req.models;
  const { email, password } = req.body;
  
  if (!email || !password) return res.status(400).json({ message: 'email and password required' });
  
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    
    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
     console.log('--- LOGIN: SIGNING TOKEN ---');
  console.log('SECRET KEY USED:', config.jwt.secret);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
     console.log('TOKEN CREATED:', token);
  console.log('---------------------------\n');
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { register, login };