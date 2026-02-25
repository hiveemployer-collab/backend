const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  // User who posted the job
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Job Details
  category: {
    type: String,
    required: true,
    enum: ['Cleaning', 'Outdoor Help', 'Home Repairs', 'Painting', 'Plumbing', 
           'Electrical', 'Carpentry', 'Moving', 'Assembly', 'Mounting', 
           'Gardening', 'Pool Maintenance', 'AC Repair', 'Appliance Repair', 'Other']
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
  
  // Date & Time
  preferredDate: {
    type: Date,
    required: true
  },
  
  preferredTime: {
    type: String,
    required: true
  },
  
  // Duration & Budget
  duration: {
    type: String,
    enum: ['1-2', '2-4', '4-8', '1-day', 'multi-day', '']
  },
  
  budget: {
    type: Number,
    min: 0
  },
  
  // Urgency
  urgency: {
    type: String,
    enum: ['normal', 'urgent', 'asap'],
    default: 'normal'
  },
  
  // Status
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  
  // Applications/Quotes from providers
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
  
  // Selected provider (if accepted)
  selectedProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
  
}, {
  timestamps: true
});

// Index for searching
jobSchema.index({ category: 1, location: 1, status: 1 });
jobSchema.index({ postedBy: 1 });

module.exports = mongoose.model('Job', jobSchema);