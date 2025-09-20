// src/controllers/sweetController.js
const { Op } = require('sequelize');

// Add a new sweet

async function addSweet(req, res) {
  const { Sweet } = req.models;
  const { name, category, price, quantity } = req.body;
  if (!name || !category || price == null || quantity == null) {
    return res.status(400).json({ message: 'Name, category, price, and quantity are required' });
  }
  try {
    const sweet = await Sweet.create({ name, category, price, quantity });
    return res.status(201).json(sweet);
  } catch (err) {
    console.error('Error in addSweet:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function listSweets(req, res) {
  const { Sweet } = req.models;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const { count, rows } = await Sweet.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']],
    });
    return res.json({
      sweets: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error('Error in listSweets:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function searchSweets(req, res) {
  const { Sweet } = req.models;
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (category && category !== 'All') where.category = category;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }
    const { count, rows } = await Sweet.findAndCountAll({ where, limit, offset });
    return res.json({
      sweets: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error('Error in searchSweets:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function getUniqueCategories(req, res) {
  const { Sweet } = req.models;
  try {
    const categories = await Sweet.findAll({
      attributes: ['category'],
      group: ['category'],
    });
    const categoryNames = categories.map(c => c.category);
    return res.json(categoryNames);
  } catch (err) {
    console.error('Error in getUniqueCategories:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function updateSweet(req, res) {
  const { Sweet } = req.models;
  try {
    const { id } = req.params;
    const sweet = await Sweet.findByPk(id);
    if (!sweet) return res.status(404).json({ message: 'Not found' });
    await sweet.update(req.body);
    return res.json({ message: 'Sweet updated', sweet });
  } catch (err) {
    console.error('Error in updateSweet:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function deleteSweet(req, res) {
  const { Sweet } = req.models;
  try {
    const { id } = req.params;
    const sweet = await Sweet.findByPk(id);
    if (!sweet) return res.status(404).json({ message: 'Not found' });
    await sweet.destroy();
    return res.json({ message: 'Sweet deleted' });
  } catch (err) {
    console.error('Error in deleteSweet:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// Purchase a sweet - IMPROVED
async function purchaseSweet(req, res) {
  const { Sweet } = req.models;
  const { id } = req.params;
  const { quantity } = req.body;

  // ✅ Robust validation
  const qty = parseInt(quantity, 10);
  if (isNaN(qty) || qty <= 0) {
    return res.status(400).json({ message: 'A valid, positive quantity is required.' });
  }

  try {
    const sweet = await Sweet.findByPk(id);
    if (!sweet) return res.status(404).json({ message: 'Not found' });
    if (sweet.quantity < qty) return res.status(400).json({ message: 'Insufficient stock' });
    
    sweet.quantity -= qty;
    await sweet.save();
    
    return res.json({ message: 'Purchase successful', sweet });
  } catch (err) {
    console.error('Error in purchaseSweet:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// Restock a sweet - IMPROVED
async function restockSweet(req, res) {
  const { Sweet } = req.models;
  const { id } = req.params;
  const { quantity } = req.body;

  // ✅ Robust validation to prevent NaN errors
  const qty = parseInt(quantity, 10);
  if (isNaN(qty) || qty <= 0) {
    return res.status(400).json({ message: 'A valid, positive quantity is required.' });
  }
  
  try {
    const sweet = await Sweet.findByPk(id);
    if (!sweet) {
      return res.status(404).json({ message: 'Not found' });
    }
    
    sweet.quantity += qty;
    await sweet.save();
    
    return res.json({ message: 'Restocked successfully', sweet });
  } catch (err) {
    // This will now only catch true server/database errors, not bad input.
    console.error('Error in restockSweet:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  addSweet,
  listSweets,
  searchSweets,
  getUniqueCategories,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
};