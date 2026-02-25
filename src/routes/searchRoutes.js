const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const Job = require('../models/Job');

router.post('/', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ message: 'Query is required' });

    const q = query.trim().toLowerCase();

    // Split into words and build a regex that matches any of them
    const words = q.split(/\s+/).filter(w => w.length > 2); // ignore tiny words like "a", "my"
    const regexPattern = words.length > 0 ? words.join('|') : q;
    const regex = new RegExp(regexPattern, 'i');

    // Search services
    const services = await Service.find({
      status: 'active',
      $or: [
        { title: regex },
        { category: regex },
        { description: regex },
        { location: regex },
      ]
    }).limit(20);

    // Search jobs
    const jobs = await Job.find({
      status: { $in: ['open', 'pending'] },
      $or: [
        { title: regex },
        { category: regex },
        { description: regex },
        { location: regex },
      ]
    }).limit(20);

    const total = services.length + jobs.length;
    const summary = total > 0
      ? `Found ${total} result${total !== 1 ? 's' : ''} for "${query}"`
      : `No results found for "${query}"`;

    res.json({ summary, services, jobs });

  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
});

module.exports = router;