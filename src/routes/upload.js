const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinaryConfig');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Service = require('../models/Service');
const multer = require('multer');
const memoryStorage = multer.memoryStorage();
const testUpload = multer({ storage: memoryStorage });

// SIMPLE GET TEST
router.get('/hello', (req, res) => {
  res.json({ message: 'Upload routes are working!' });
});
// TEST ROUTE - Simple multer test
router.post('/test', protect, testUpload.array('images', 5), async (req, res) => {
  console.log('TEST ROUTE - req.files:', req.files);
  console.log('TEST ROUTE - req.body:', req.body);
  res.json({ 
    message: 'Test route hit',
    filesReceived: req.files ? req.files.length : 0,
    files: req.files
  });
});
router.post('/test', protect, testUpload.array('images', 5), async (req, res) => {
  console.log('TEST ROUTE - req.files:', req.files);
  console.log('TEST ROUTE - req.body:', req.body);
  res.json({ 
    message: 'Test route hit',
    filesReceived: req.files ? req.files.length : 0,
    files: req.files
  });
});

// ADD HERE ↓
router.post('/test-no-auth', async (req, res) => {
  console.log('NO AUTH TEST - Hit!');
  res.json({ message: 'No auth test works!' });
});
// ========================================
// PROFILE PICTURE UPLOAD
// ========================================

// @route   POST /api/upload/profile
// @desc    Upload profile picture
// @access  Private (any authenticated user)
router.post('/profile', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Get the uploaded image URL from Cloudinary
    const imageUrl = req.file.path;

    // Update user's profile picture in database
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: imageUrl },
      { new: true }
    ).select('-password');

    res.status(200).json({
      message: 'Profile picture uploaded successfully',
      imageUrl: imageUrl,
      user: user
    });
  } catch (error) {
    console.error('Profile upload error:', error);
    res.status(500).json({ message: 'Error uploading profile picture', error: error.message });
  }
});

// ========================================
// SERVICE IMAGE UPLOAD
// ========================================

// @route   POST /api/upload/service/:serviceId
// @desc    Upload service images (up to 5 images)
// @access  Private (provider only - service owner)
router.post('/service/:serviceId', protect, upload.array('images', 5), async (req, res) => {
  try {
    console.log('=== SERVICE IMAGE UPLOAD DEBUG ===');
    console.log('req.files:', req.files);
    console.log('req.body:', req.body);
    console.log('================================');
    
   if (!req.files || req.files.length === 0) {
  return res.status(400).json({ message: 'No image files provided' });
}
    // Find the service
    const service = await Service.findById(req.params.serviceId);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if the user is the owner of the service
    if (service.providerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to upload images for this service' });
    }

    // Get all uploaded image URLs
    const imageUrls = req.files.map(file => file.path);

    // Add new images to service (append to existing images)
    service.images = [...service.images, ...imageUrls];

    await service.save();

    res.status(200).json({
      message: `${imageUrls.length} image(s) uploaded successfully`,
      imageUrls: imageUrls,
      service: service
    });
  } catch (error) {
    console.error('Service image upload error:', error);
    res.status(500).json({ message: 'Error uploading service images', error: error.message });
  }
});

// ========================================
// DELETE SERVICE IMAGE
// ========================================

// @route   DELETE /api/upload/service/:serviceId/image
// @desc    Delete a specific image from a service
// @access  Private (provider only - service owner)
router.delete('/service/:serviceId/image', protect, async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    // Find the service
    const service = await Service.findById(req.params.serviceId);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if the user is the owner of the service
    if (service.providerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete images for this service' });
    }

    // Remove the image URL from the service
    service.images = service.images.filter(img => img !== imageUrl);

    await service.save();

    res.status(200).json({
      message: 'Image deleted successfully',
      service: service
    });
  } catch (error) {
    console.error('Image delete error:', error);
    res.status(500).json({ message: 'Error deleting image', error: error.message });
  }
});

// ========================================
// GET USER PROFILE WITH IMAGE
// ========================================

// @route   GET /api/upload/profile/:userId
// @desc    Get user profile (public - to see profile pictures)
// @access  Public
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      name: user.name,
      profilePicture: user.profilePicture,
      bio: user.bio,
      location: user.location,
      role: user.role
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

module.exports = router;