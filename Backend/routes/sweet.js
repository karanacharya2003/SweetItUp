// src/routes/sweet.js
const express = require('express');
const router = express.Router();
const sweetController = require('../controllers/sweetControllers');
const { authenticate, authorize } = require('../middleware/auth');

console.log("✅ sweet.js router file has been loaded.");

// GET /api/sweets -> List all sweets with pagination
router.get('/', sweetController.listSweets);

// GET /api/sweets/search -> Search sweets with pagination
router.get('/search', sweetController.searchSweets);

// GET /api/sweets/categories -> Get all unique categories
router.get('/categories', sweetController.getUniqueCategories);

// POST /api/sweets -> Add a new sweet (Admin only)
router.post('/', authenticate, authorize(['admin']), sweetController.addSweet);

// PUT /api/sweets/:id -> Update a sweet (Admin only)
router.put('/:id', authenticate, authorize(['admin']), sweetController.updateSweet);

// DELETE /api/sweets/:id -> Delete a sweet (Admin only)
router.delete('/:id', authenticate, authorize(['admin']), sweetController.deleteSweet);

// POST /api/sweets/:id/purchase -> Purchase a sweet
router.post('/:id/purchase', authenticate, sweetController.purchaseSweet);

// POST /api/sweets/:id/restock -> Restock a sweet (Admin only)
router.post('/:id/restock', authenticate, authorize(['admin']), sweetController.restockSweet);

module.exports = router;