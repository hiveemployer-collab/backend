const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'https://inhive.work'}/reset-password?token=${resetToken}`;
  try {
    await transporter.sendMail({
      from: `"HIVE" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'HIVE - Password Reset Request',
      html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
        <h1 style="color:#F59E0B;">HIVE</h1>
        <h2>Reset Your Password</h2>
        <p>Click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#F59E0B;color:white;padding:12px 30px;border-radius:8px;text-decoration:none;font-weight:bold;margin:20px 0;">Reset Password</a>
        <p style="color:#999;font-size:12px;">If you didn't request this, ignore this email.</p>
        <hr/><p style="color:#999;font-size:12px;text-align:center;">© 2025 HIVE · Made in Sri Lanka 🇱🇰</p>
      </div>`,
    });
    console.log('Password reset email sent to:', email);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendPasswordResetEmail };