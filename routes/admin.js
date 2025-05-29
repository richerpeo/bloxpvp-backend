const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/adminController');
const adminAuth = require('../middleware/adminAuth');

// Apply admin authentication to all routes
router.use(adminAuth);

// Admin routes
router.put('/pinned-message', adminController.updatePinnedMessage);
router.get('/pinned-message', adminController.getPinnedMessage);

module.exports = router;
