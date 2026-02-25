const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');

// Create new booking
exports.createBooking = async (req, res) => {
  try {
    const {
      serviceId,
      bookingDate,
      bookingTime,
      duration,
      address,
      customerNotes,
      paymentMethod,
    } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (req.user.userType !== 'customer') {
      return res.status(403).json({ message: 'Only customers can create bookings' });
    }

    const totalPrice = service.priceType === 'hourly' 
      ? service.price * (duration || 1)
      : service.price;

    const booking = await Booking.create({
      serviceId,
      customerId: req.user.id,
      providerId: service.providerId,
      bookingDate,
      bookingTime,
      duration,
      totalPrice,
      address,
      customerNotes,
      paymentMethod,
    });

    await booking.populate('serviceId', 'title mainCategory subcategory');
    await booking.populate('providerId', 'name email phone');

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};// Get all bookings (with filters)
exports.getAllBookings = async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = {};

    if (req.user.userType === 'customer') {
      query.customerId = req.user.id;
    } else if (req.user.userType === 'provider') {
      query.providerId = req.user.id;
    }

    if (status) query.status = status;

    if (startDate || endDate) {
      query.bookingDate = {};
      if (startDate) query.bookingDate.$gte = new Date(startDate);
      if (endDate) query.bookingDate.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(query)
      .populate('serviceId', 'title mainCategory subcategory price priceType images')
      .populate('customerId', 'name email phone')
      .populate('providerId', 'name email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Booking.countDocuments(query);

    res.json({
      success: true,
      bookings,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('serviceId', 'title mainCategory subcategory price priceType images description')
      .populate('customerId', 'name email phone')
      .populate('providerId', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (
      booking.customerId._id.toString() !== req.user.id &&
      booking.providerId._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, providerNotes, cancellationReason } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isProvider = booking.providerId.toString() === req.user.id;
    const isCustomer = booking.customerId.toString() === req.user.id;

    if (!isProvider && !isCustomer) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    if (isCustomer && !['cancelled'].includes(status)) {
      return res.status(403).json({ message: 'Customers can only cancel bookings' });
    }

    if (isProvider && !['confirmed', 'rejected', 'in-progress', 'completed'].includes(status)) {
      return res.status(403).json({ message: 'Invalid status for provider' });
    }

    booking.status = status;
    if (providerNotes) booking.providerNotes = providerNotes;
    if (cancellationReason) booking.cancellationReason = cancellationReason;
    if (status === 'completed') booking.completedAt = Date.now();
    if (status === 'cancelled') booking.cancelledAt = Date.now();

    await booking.save();

    if (status === 'completed') {
      await Service.findByIdAndUpdate(booking.serviceId, {
        $inc: { totalBookings: 1 },
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (
      booking.customerId.toString() !== req.user.id &&
      booking.providerId.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.paymentStatus = paymentStatus;
    await booking.save();

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.customerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Can only delete pending bookings' });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get booking statistics
exports.getBookingStats = async (req, res) => {
  try {
    const query = {};
    
    if (req.user.userType === 'customer') {
      query.customerId = req.user.id;
    } else if (req.user.userType === 'provider') {
      query.providerId = req.user.id;
    }

    const stats = await Booking.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]);

    const totalBookings = await Booking.countDocuments(query);
    const completedBookings = await Booking.countDocuments({ ...query, status: 'completed' });

    res.json({
      success: true,
      stats,
      totalBookings,
      completedBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};