// src/routes/sweetRoutes.js
const express = require('express');
const router = express.Router();
const sweetController = require('../controllers/sweetControllers');
const { authenticate, authorize } = require('../middleware/auth'); // Assuming you have auth middleware

// GET /api/sweets -> List all sweets with pagination
router.get('/', sweetController.listSweets);

// GET /api/sweets/search -> Search sweets with pagination
router.get('/search', sweetController.searchSweets);

// POST /api/sweets -> Add a new sweet
router.post('/', authenticate, authorize(['admin']), sweetController.addSweet);

// PUT /api/sweets/:id -> Update a sweet
router.put('/:id', authenticate, authorize(['admin']), sweetController.updateSweet);

// DELETE /api/sweets/:id -> Delete a sweet
router.delete('/:id', authenticate, authorize(['admin']), sweetController.deleteSweet);

// POST /api/sweets/:id/purchase -> Purchase a sweet
router.post('/:id/purchase', authenticate, sweetController.purchaseSweet);

// POST /api/sweets/:id/restock -> Restock a sweet
router.post('/:id/restock', authenticate, authorize(['admin']), sweetController.restockSweet);


module.exports = router;