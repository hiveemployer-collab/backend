const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'https://inhive.work'}/reset-password?token=${resetToken}`;
  try {
    await resend.emails.send({
      from: 'HIVE <noreply@inhive.work>',
      to: email,
      subject: 'HIVE - Password Reset Request',
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;">
        <h1 style="color:#F59E0B;margin-bottom:4px;">HIVE 🐝</h1>
        <h2 style="color:#111;">Reset Your Password</h2>
        <p style="color:#555;">Click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#F59E0B;color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:bold;margin:20px 0;font-size:16px;">Reset Password</a>
        <p style="color:#999;font-size:12px;margin-top:24px;">If you didn't request this, you can safely ignore this email.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
        <p style="color:#bbb;font-size:11px;">HIVE — Trusted Local Services · inhive.work</p>
      </div>`,
    });
    console.log('Password reset email sent to:', email);
    return { success: true };
  } catch (error) {
    console.error('Error sending reset email:', error);
    return { success: false, error: error.message };
  }
};

const sendWelcomeEmail = async (email, name) => {
  try {
    await resend.emails.send({
      from: 'HIVE <noreply@inhive.work>',
      to: email,
      subject: 'Welcome to HIVE 🐝 — You\'re In!',
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;">
        <h1 style="color:#F59E0B;margin-bottom:4px;">HIVE 🐝</h1>
        <h2 style="color:#111;">Welcome,
cat > "/Users/yevinsilva/Desktop/hive-backend/src/config/emailService.js" << 'EOF'
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'https://inhive.work'}/reset-password?token=${resetToken}`;
  try {
    await resend.emails.send({
      from: 'HIVE <noreply@inhive.work>',
      to: email,
      subject: 'HIVE - Password Reset Request',
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;">
        <h1 style="color:#F59E0B;margin-bottom:4px;">HIVE 🐝</h1>
        <h2 style="color:#111;">Reset Your Password</h2>
        <p style="color:#555;">Click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#F59E0B;color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:bold;margin:20px 0;font-size:16px;">Reset Password</a>
        <p style="color:#999;font-size:12px;margin-top:24px;">If you didn't request this, you can safely ignore this email.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
        <p style="color:#bbb;font-size:11px;">HIVE — Trusted Local Services · inhive.work</p>
      </div>`,
    });
    console.log('Password reset email sent to:', email);
    return { success: true };
  } catch (error) {
    console.error('Error sending reset email:', error);
    return { success: false, error: error.message };
  }
};

const sendWelcomeEmail = async (email, name) => {
  try {
    await resend.emails.send({
      from: 'HIVE <noreply@inhive.work>',
      to: email,
      subject: 'Welcome to HIVE 🐝 — You\'re In!',
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;">
        <h1 style="color:#F59E0B;margin-bottom:4px;">HIVE 🐝</h1>
        <h2 style="color:#111;">Welcome, ${name}! You're in.</h2>
        <p style="color:#555;font-size:15px;">Thanks for joining HIVE — Sri Lanka's trusted local services marketplace. Here's how to get started:</p>
        
        <div style="background:#FFFBEB;border-left:4px solid #F59E0B;padding:16px;border-radius:8px;margin:20px 0;">
          <h3 style="color:#111;margin-top:0;">🔍 Looking for help?</h3>
          <p style="color:#555;margin:0;">Search for any service on the homepage — cleaning, electrical, photography, tutoring and more. Browse providers, check reviews and get in touch directly.</p>
        </div>

        <div style="background:#F0FDF4;border-left:4px solid #22C55E;padding:16px;border-radius:8px;margin:20px 0;">
          <h3 style="color:#111;margin-top:0;">💼 Want to earn?</h3>
          <p style="color:#555;margin:0;">List your skills as a service on HIVE for free. Set your own price, choose your hours and connect with thousands of customers across Sri Lanka.</p>
        </div>

        <div style="background:#EFF6FF;border-left:4px solid #3B82F6;padding:16px;border-radius:8px;margin:20px 0;">
          <h3 style="color:#111;margin-top:0;">⭐ Build your reputation</h3>
          <p style="color:#555;margin:0;">Every completed job earns you a review. The more reviews you get, the more you'll appear in searches. Start strong — deliver great work every time.</p>
        </div>

        <a href="https://inhive.work" style="display:inline-block;background:#F59E0B;color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:bold;margin:20px 0;font-size:16px;">Go to HIVE</a>

        <p style="color:#999;font-size:12px;margin-top:24px;">If you have any questions, reply to this email or visit our <a href="https://inhive.work/contact" style="color:#F59E0B;">Contact page</a>.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
        <p style="color:#bbb;font-size:11px;">HIVE — Trusted Local Services · inhive.work</p>
      </div>`,
    });
    console.log('Welcome email sent to:', email);
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendPasswordResetEmail, sendWelcomeEmail };
