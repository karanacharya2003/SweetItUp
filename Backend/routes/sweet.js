const express = require('express');
const router = express.Router();
const sweetCtrl = require('../controllers/sweetControllers');
const { authenticate, requireAdmin } = require('../middleware/auth');


// --- Public Routes ---
// Anyone can view the list of sweets or search for them.
router.get('/', sweetCtrl.listSweets);
router.get('/search', sweetCtrl.searchSweets);


// --- Authenticated User Routes ---
// Any logged-in user can purchase a sweet.
router.post('/:id/purchase', authenticate, sweetCtrl.purchaseSweet);


// --- Admin Only Routes ---
// Only logged-in admins can add, update, delete, or restock sweets.
router.post('/', [authenticate, requireAdmin], sweetCtrl.addSweet);
router.put('/:id', [authenticate, requireAdmin], sweetCtrl.updateSweet);
router.delete('/:id', [authenticate, requireAdmin], sweetCtrl.deleteSweet);
router.post('/:id/restock', [authenticate, requireAdmin], sweetCtrl.restockSweet);


module.exports = router;