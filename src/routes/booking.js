const express = require('express');
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  updatePaymentStatus,
  deleteBooking,
  getBookingStats,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All booking routes require authentication
router.use(protect);

// Booking routes
router.post('/', createBooking);
router.get('/', getAllBookings);
router.get('/stats', getBookingStats);
router.get('/:id', getBookingById);
router.put('/:id/status', updateBookingStatus);
router.put('/:id/payment', updatePaymentStatus);
router.delete('/:id', deleteBooking);

module.exports = router;