const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'https://inhive.work'}/reset-password?token=${resetToken}`;
  try {
    await resend.emails.send({
      from: 'HIVE <noreply@inhive.work>',
      to: email,
      subject: 'HIVE - Password Reset Request',
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h1 style="color:#F59E0B;">HIVE 🐝</h1>
        <h2>Reset Your Password</h2>
        <p style="color:#555;">Click below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#F59E0B;color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:bold;margin:20px 0;">Reset Password</a>
        <p style="color:#999;font-size:12px;">If you didn't request this, ignore this email.</p>
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
      subject: "Welcome to HIVE 🐝 — You're In!",
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h1 style="color:#F59E0B;">HIVE 🐝</h1>
        <h2 style="color:#111;">Welcome, ${name}! You're in.</h2>
        <p style="color:#555;">Thanks for joining HIVE — Sri Lanka's trusted local services marketplace.</p>
        <div style="background:#FFFBEB;border-left:4px solid #F59E0B;padding:16px;border-radius:8px;margin:20px 0;">
          <h3 style="color:#111;margin-top:0;">🔍 Looking for help?</h3>
          <p style="color:#555;margin:0;">Search for any service — cleaning, electrical, photography, tutoring and more.</p>
        </div>
        <div style="background:#F0FDF4;border-left:4px solid #22C55E;padding:16px;border-radius:8px;margin:20px 0;">
          <h3 style="color:#111;margin-top:0;">💼 Want to earn?</h3>
          <p style="color:#555;margin:0;">List your skills as a service for free. Set your own price and connect with thousands of customers.</p>
        </div>
        <div style="background:#EFF6FF;border-left:4px solid #3B82F6;padding:16px;border-radius:8px;margin:20px 0;">
          <h3 style="color:#111;margin-top:0;">⭐ Build your reputation</h3>
          <p style="color:#555;margin:0;">Every completed job earns you a review. The more reviews you get, the more visible you become.</p>
        </div>
        <a href="https://inhive.work" style="display:inline-block;background:#F59E0B;color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:bold;margin:20px 0;">Go to HIVE</a>
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

const sendVerificationEmail = async (email, name, verifyToken) => {
  const verifyUrl = `${process.env.FRONTEND_URL || 'https://inhive.work'}/verify-email?token=${verifyToken}`;
  try {
    await resend.emails.send({
      from: 'HIVE <noreply@inhive.work>',
      to: email,
      subject: 'HIVE - Please Verify Your Email',
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h1 style="color:#F59E0B;">HIVE 🐝</h1>
        <h2 style="color:#111;">Hey ${name}, verify your email</h2>
        <p style="color:#555;">You're almost there! Click the button below to verify your email and activate your HIVE account.</p>
        <a href="${verifyUrl}" style="display:inline-block;background:#F59E0B;color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:bold;margin:20px 0;font-size:16px;">Verify My Email</a>
        <p style="color:#999;font-size:13px;">This link expires in 24 hours. If you didn't create a HIVE account, you can safely ignore this email.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
        <p style="color:#bbb;font-size:11px;">HIVE — Trusted Local Services · inhive.work</p>
      </div>`,
    });
    console.log('Verification email sent to:', email);
    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendPasswordResetEmail, sendWelcomeEmail, sendVerificationEmail };