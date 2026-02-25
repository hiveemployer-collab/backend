const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookingDate: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    bookingTime: {
      type: String,
      required: [true, 'Booking time is required'],
    },
    duration: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'rejected'],
      default: 'pending',
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    address: {
      street: String,
      city: String,
      district: String,
      postalCode: String,
      additionalInfo: String,
    },
    customerNotes: {
      type: String,
      maxlength: 500,
    },
    providerNotes: {
      type: String,
      maxlength: 500,
    },
    cancellationReason: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'online', 'bank-transfer'],
    },
    completedAt: Date,
    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ customerId: 1, status: 1 });
bookingSchema.index({ providerId: 1, status: 1 });
bookingSchema.index({ serviceId: 1 });
bookingSchema.index({ bookingDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);