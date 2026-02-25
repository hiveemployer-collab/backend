const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      maxlength: 1000,
    },
    images: [String],
    isVerified: {
      type: Boolean,
      default: false,
    },
    providerResponse: {
      type: String,
      maxlength: 500,
    },
    respondedAt: Date,
    helpfulCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
reviewSchema.index({ serviceId: 1, rating: -1 });
reviewSchema.index({ providerId: 1 });
reviewSchema.index({ customerId: 1 });

// Prevent duplicate reviews per booking
reviewSchema.index({ bookingId: 1 }, { unique: true });

// Update service and provider ratings after review
reviewSchema.post('save', async function() {
  try {
    const Review = this.constructor;
    const Service = mongoose.model('Service');
    const User = mongoose.model('User');

    // Calculate average rating for service
    const serviceStats = await Review.aggregate([
      { $match: { serviceId: this.serviceId } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (serviceStats.length > 0) {
      await Service.findByIdAndUpdate(this.serviceId, {
        averageRating: Math.round(serviceStats[0].avgRating * 10) / 10,
      });
    }

    // Calculate average rating for provider
    const providerStats = await Review.aggregate([
      { $match: { providerId: this.providerId } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (providerStats.length > 0) {
      await User.findByIdAndUpdate(this.providerId, {
        averageRating: Math.round(providerStats[0].avgRating * 10) / 10,
        totalReviews: providerStats[0].totalReviews,
      });
    }
  } catch (error) {
    console.error('Error updating ratings:', error);
  }
});

module.exports = mongoose.model('Review', reviewSchema);