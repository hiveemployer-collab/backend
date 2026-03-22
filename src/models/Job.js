const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      // Home & Trades
      'Cleaning', 'Home Repairs', 'Painting', 'Plumbing', 'Electrical',
      'Carpentry', 'Moving', 'Assembly', 'Mounting', 'Gardening',
      'Outdoor Help', 'Pool Maintenance', 'AC Repair', 'Appliance Repair',
      // Creative & Digital
      'Photography', 'Videography', 'Content Creation', 'Social Media Management',
      'Graphic Design', 'Video Editing', 'Music & Audio', 'Voiceover', 'Animation',
      // Tech
      'Web Development', 'App Development', 'IT Support', 'Gaming & Streaming', 'Data Entry',
      // Education & Coaching
      'Tutoring', 'Language Classes', 'Music Lessons', 'Personal Training',
      'Life Coaching', 'Mental Health Support',
      // Lifestyle
      'Pet Care', 'Pet Grooming', 'Dog Walking', 'Beauty & Makeup',
      'Hair Styling', 'Event Planning', 'Catering', 'Personal Chef',
      // Business
      'Accounting', 'Legal Advice', 'Virtual Assistant', 'Translation', 'Consulting',
      // Other
      'Other'
    ]
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  location: {
    type: String,
    required: true
  },
  preferredDate: {
    type: Date,
    required: true
  },
  preferredTime: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    enum: ['1-2', '2-4', '4-8', '1-day', 'multi-day', '']
  },
  budget: {
    type: Number,
    min: 0
  },
  urgency: {
    type: String,
    enum: ['normal', 'urgent', 'asap'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  applications: [{
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    quote: Number,
    message: String,
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  }],
  selectedProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

jobSchema.index({ category: 1, location: 1, status: 1 });
jobSchema.index({ postedBy: 1 });

module.exports = mongoose.model('Job', jobSchema);