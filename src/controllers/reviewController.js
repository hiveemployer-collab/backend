const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

// Create new review
exports.createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment, images } = req.body;

    // Check if booking exists and is completed
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only customer who made the booking can review
    if (booking.customerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to review this booking' });
    }

    // Only completed bookings can be reviewed
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed bookings' });
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this booking' });
    }

    const review = await Review.create({
      serviceId: booking.serviceId,
      providerId: booking.providerId,
      customerId: req.user.id,
      bookingId,
      rating,
      comment,
      images,
      isVerified: true,
    });

    await review.populate('customerId', 'name profilePicture');
    await review.populate('serviceId', 'title');

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for a service
exports.getServiceReviews = async (req, res) => {
  try {
    const { rating, page = 1, limit = 10 } = req.query;
    const query = { serviceId: req.params.serviceId };

    if (rating) {
      query.rating = Number(rating);
    }

    const reviews = await Review.find(query)
      .populate('customerId', 'name profilePicture')
      .populate('serviceId', 'title')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Review.countDocuments(query);

    // Calculate rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { serviceId: mongoose.Types.ObjectId(req.params.serviceId) } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    res.json({
      success: true,
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
      ratingDistribution,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews by provider
exports.getProviderReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ providerId: req.params.providerId })
      .populate('customerId', 'name profilePicture')
      .populate('serviceId', 'title mainCategory subcategory')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Review.countDocuments({ providerId: req.params.providerId });

    res.json({
      success: true,
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single review
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('customerId', 'name profilePicture')
      .populate('providerId', 'name')
      .populate('serviceId', 'title mainCategory subcategory');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update review (customer can update their own review)
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment, images } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Only the customer who created the review can update it
    if (review.customerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    if (images) review.images = images;

    await review.save();

    res.json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Provider response to review
exports.respondToReview = async (req, res) => {
  try {
    const { providerResponse } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Only the provider can respond
    if (review.providerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to respond to this review' });
    }

    review.providerResponse = providerResponse;
    review.respondedAt = Date.now();

    await review.save();

    res.json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Only customer who created the review can delete it
    if (review.customerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark review as helpful
exports.markHelpful = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};