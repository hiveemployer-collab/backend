// FILE: routes/forgotPasswordRoutes.js
// Run: npm install nodemailer crypto
// Add to your server.js: app.use('/api/auth', require('./routes/forgotPasswordRoutes'));

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User'); // adjust path if needed
const bcrypt = require('bcryptjs');

// ─── Email Transporter ───────────────────────────────────────────────
// Go to: https://myaccount.google.com/apppasswords
// Create an App Password for "Mail" → paste it in GMAIL_APP_PASSWORD
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,        // your Gmail e.g. hivesrilanka@gmail.com
    pass: process.env.GMAIL_APP_PASSWORD // 16-char app password (NOT your real password)
  }
});

// ─── POST /api/auth/forgot-password ──────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always return success (don't reveal if email exists)
    if (!user) {
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpiry = expiry;
    await user.save();

    // Reset link — update domain if needed
    const resetLink = `https://inhive.work/reset-password?token=${token}`;

    await transporter.sendMail({
      from: `"HIVE" <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: '🔑 Reset Your HIVE Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #FBBF24, #F59E0B); border-radius: 12px; padding: 12px; transform: rotate(12deg);">
              <span style="font-size: 24px; display: block; transform: rotate(-12deg);">🔧</span>
            </div>
            <h1 style="color: #111827; font-size: 24px; font-weight: 900; margin-top: 16px;">HIVE</h1>
          </div>
          <h2 style="color: #111827; font-size: 20px; font-weight: 700;">Reset Your Password</h2>
          <p style="color: #6B7280; font-size: 15px;">Hi ${user.name || 'there'},</p>
          <p style="color: #6B7280; font-size: 15px;">We received a request to reset your HIVE password. Click the button below to set a new one:</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetLink}" style="background: linear-gradient(135deg, #FBBF24, #F59E0B); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #9CA3AF; font-size: 13px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
          <p style="color: #9CA3AF; font-size: 12px; text-align: center;">© 2025 HIVE · Made in Sri Lanka 🇱🇰</p>
        </div>
      `
    });

    res.json({ message: 'If that email exists, a reset link has been sent.' });

  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// ─── POST /api/auth/reset-password ───────────────────────────────────
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: 'Token and password are required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Reset link is invalid or has expired.' });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. You can now sign in.' });

  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;