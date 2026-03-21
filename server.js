require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');

// Connect to MongoDB
connectDB();

const app = express();

// ─── CORS ────────────────────────────────────────────────────────────
const allowedOrigins = [
  'https://inhive.work',
  'https://www.inhive.work',
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // mobile apps, Postman, curl
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));



// ─── Middleware ───────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health check (wakes up Render + used by frontend ping) ──────────
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ─── Routes ───────────────────────────────────────────────────────────
const authRoutes = require('./src/routes/auth');
const serviceRoutes = require('./src/routes/service');
const bookingRoutes = require('./src/routes/booking');
const reviewRoutes = require('./src/routes/review');
const uploadRoutes = require('./src/routes/upload');
const jobRoutes = require('./src/routes/job');
const searchRoutes = require('./src/routes/searchRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/search', searchRoutes);

// ─── Root ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to HIVE API' });
});

// ─── Start server ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});