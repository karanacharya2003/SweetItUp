// src/controllers/sweetControllers.js

// ❌ REMOVE this line: const db = require('../models');
const { Op } = require('sequelize');

// Add a new sweet
async function addSweet(req, res) {
  // ✅ Get the initialized Sweet model from the request object
  const { Sweet } = req.models;
  const { name, category, price, quantity } = req.body;
  if (!name || !category || price == null || quantity == null) {
    return res.status(400).json({ message: 'name, category, price, and quantity required' });
  }
  try {
    const sweet = await Sweet.create({ name, category, price, quantity });
    return res.status(201).json(sweet);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// List all sweets
async function listSweets(req, res) {
  const { Sweet } = req.models;
  try {
    const sweets = await Sweet.findAll();
    return res.json(sweets);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// Search sweets
async function searchSweets(req, res) {
  const { Sweet } = req.models;
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (category) where.category = category;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }
    const sweets = await Sweet.findAll({ where });
    return res.json(sweets);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// Update sweet
async function updateSweet(req, res) {
  const { Sweet } = req.models;
  try {
    const { id } = req.params;
    const { name, category, price, quantity } = req.body;
    const sweet = await Sweet.findByPk(id);
    if (!sweet) return res.status(404).json({ message: 'Not found' });
    await sweet.update({ name, category, price, quantity });
    return res.json({ message: 'Sweet updated', sweet });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// Delete sweet
async function deleteSweet(req, res) {
  const { Sweet } = req.models;
  try {
    const { id } = req.params;
    const sweet = await Sweet.findByPk(id);
    if (!sweet) return res.status(404).json({ message: 'Not found' });
    await sweet.destroy();
    return res.json({ message: 'Sweet deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// Purchase sweet
async function purchaseSweet(req, res) {
  const { Sweet } = req.models;
  const id = req.params.id;
  const { quantity } = req.body;
  const qty = parseInt(quantity || 1, 10);
  if (qty <= 0) return res.status(400).json({ message: 'Invalid quantity' });
  try {
    const sweet = await Sweet.findByPk(id);
    if (!sweet) return res.status(404).json({ message: 'Not found' });
    if (sweet.quantity < qty) return res.status(400).json({ message: 'Insufficient stock' });
    sweet.quantity -= qty;
    await sweet.save();
    return res.json({ message: 'Purchase successful', sweet });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// Restock sweet
async function restockSweet(req, res) {
  const { Sweet } = req.models;
  const id = req.params.id;
  const { quantity } = req.body;
  const qty = parseInt(quantity || 0, 10);
  if (qty <= 0) return res.status(400).json({ message: 'Invalid quantity' });
  try {
    const sweet = await Sweet.findByPk(id);
    if (!sweet) return res.status(404).json({ message: 'Not found' });
    sweet.quantity += qty;
    await sweet.save();
    return res.json({ message: 'Restocked', sweet });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  addSweet,
  listSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
};