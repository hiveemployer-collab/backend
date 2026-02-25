const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mainCategory: {
    type: String,
    required: [true, 'Main category is required'],
    enum: [
      'home-construction',
      'repair-maintenance',
      'cleaning-gardening',
      'beauty-wellness',
      'events-entertainment',
      'education-training',
      'it-technology',
      'business-professional',
      'transport-logistics',
      'food-hospitality',
      'fashion-design',
      'health-medical',
      'pet-services',
      'security-safety',
      'other-services'
    ],
  },
  subcategory: {
    type: String,
    required: [true, 'Subcategory is required'],
  },
  title: {
    type: String,
    required: [true, 'Please add a service title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  priceType: {
    type: String,
    enum: ['hourly', 'fixed', 'daily', 'project'],
    default: 'hourly'
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  skills: [{
    type: String,
    trim: true
  }],
  experience: {
    type: String,
    default: '1-2 years'
  },
  location: {
    type: String,
    required: [true, 'Please add service location']
  },
  availability: [{
    type: String
  }],
  phone: {
    type: String
  },
  email: {
    type: String
  },
  images: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  completedJobs: {
    type: Number,
    default: 0
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  responseTime: {
    type: String,
    default: '24 hours'
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

serviceSchema.index({ mainCategory: 1, location: 1, isActive: 1 });
serviceSchema.index({ providerId: 1 });

module.exports = mongoose.model('Service', serviceSchema);