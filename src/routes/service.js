const express = require('express');
const router = express.Router();
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getMyServices
} = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getAllServices);

// Protected routes (require authentication) - SPECIFIC ROUTES FIRST!
router.post('/', protect, createService);
router.get('/user/my-services', protect, getMyServices);  // ✅ MOVED BEFORE /:id
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

// Parameterized routes LAST
router.get('/:id', getServiceById);  // ✅ MOVED TO END

module.exports = router;