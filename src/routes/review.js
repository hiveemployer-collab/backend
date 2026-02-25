const express = require('express');
const {
  createReview,
  getServiceReviews,
  getProviderReviews,
  getReviewById,
  updateReview,
  respondToReview,
  deleteReview,
  markHelpful,
} = require('../controllers/reviewController');
const { protect, isProvider } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/service/:serviceId', getServiceReviews);
router.get('/provider/:providerId', getProviderReviews);
router.get('/:id', getReviewById);

// Protected routes (require authentication)
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.put('/:id/respond', protect, isProvider, respondToReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/helpful', markHelpful);

module.exports = router;