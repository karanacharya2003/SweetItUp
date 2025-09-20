// src/controllers/sweetController.js

const { Op } = require('sequelize');

// Add a new sweet - NO CHANGES
async function addSweet(req, res) {
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

// ✅ UPDATED: List all sweets with pagination
async function listSweets(req, res) {
  const { Sweet } = req.models;
  try {
    // 1. Get page and limit from query, with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // 2. Use findAndCountAll to get sweets for the page AND the total count
    const { count, rows } = await Sweet.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']],
    });

    // 3. Send back the paginated data
    return res.json({
      sweets: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err)
 {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// ✅ UPDATED: Search sweets with pagination
async function searchSweets(req, res) {
  const { Sweet } = req.models;
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (category) where.category = category;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }
    
    const { count, rows } = await Sweet.findAndCountAll({ 
        where,
        limit,
        offset 
    });

    return res.json({
        sweets: rows,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// Update sweet - NO CHANGES
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

// Delete sweet - NO CHANGES
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

// Purchase sweet - NO CHANGES
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

// Restock sweet - NO CHANGES
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