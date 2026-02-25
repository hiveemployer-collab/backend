const Job = require('../models/Job');

// Create a new job
exports.createJob = async (req, res) => {
  try {
    const {
      category,
      title,
      description,
      location,
      preferredDate,
      preferredTime,
      duration,
      budget,
      urgency
    } = req.body;

    // Create job
    const job = new Job({
      postedBy: req.user._id, // From auth middleware
      category,
      title,
      description,
      location,
      preferredDate,
      preferredTime,
      duration,
      budget,
      urgency
    });

    await job.save();

    res.status(201).json({
      success: true,
      message: 'Job posted successfully!',
      job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating job',
      error: error.message
    });
  }
};

// Get all jobs (with filters)
exports.getAllJobs = async (req, res) => {
  try {
    const { category, location, urgency, status } = req.query;
    
    // Build filter query
    let filter = {};
    
    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (urgency) filter.urgency = urgency;
    if (status) filter.status = status;
    else filter.status = 'open'; // Default: only show open jobs

    const jobs = await Job.find(filter)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
};

// Get single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email phone')
      .populate('applications.providerId', 'name email phone');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: error.message
    });
  }
};

// Update job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user is the job owner
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating job',
      error: error.message
    });
  }
};

// Delete job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user is the job owner
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting job',
      error: error.message
    });
  }
};

// Apply to job (for providers)
exports.applyToJob = async (req, res) => {
  try {
    const { quote, message } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if already applied
    const existingApplication = job.applications.find(
      app => app.providerId.toString() === req.user._id.toString()
    );

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job'
      });
    }

    // Add application
    job.applications.push({
      providerId: req.user._id,
      quote,
      message
    });

    await job.save();

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error applying to job',
      error: error.message
    });
  }
};

// Get user's posted jobs
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your jobs',
      error: error.message
    });
  }
};