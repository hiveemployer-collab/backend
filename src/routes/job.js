const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyToJob,
  getMyJobs
} = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getAllJobs);

// Protected routes (require authentication)
router.post('/', protect, createJob);
router.get('/user/my-jobs', protect, getMyJobs);
router.post('/:id/apply', protect, applyToJob);
router.get('/:id', getJobById);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

module.exports = router;