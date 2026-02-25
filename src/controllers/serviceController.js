const Service = require('../models/Service');
const User = require('../models/User');

// @desc    Create a new service
// @route   POST /api/services
// @access  Private (Provider only)
exports.createService = async (req, res) => {
  try {
    // Add user to req.body
    req.body.providerId = req.user._id;

    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Service created successfully!',
      service
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getAllServices = async (req, res) => {
  try {
    const { category, location, priceType, status = 'active' } = req.query;

    // Build query
    let query = { status };

    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (priceType) query.priceType = priceType;

    const services = await Service.find(query)
      .populate('providerId', 'name email phone profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('providerId', 'name email phone profileImage');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      service
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Provider who created it)
exports.updateService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Make sure user is service owner
    if (service.providerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this service'
      });
    }

    service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Provider who created it)
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Make sure user is service owner
    if (service.providerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this service'
      });
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get my services (provider's own services)
// @route   GET /api/services/user/my-services
// @access  Private
exports.getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ providerId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};