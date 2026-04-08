const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'https://inhive.work'}/reset-password?token=${resetToken}`;
  try {
    await resend.emails.send({
      from: 'HIVE <noreply@inhive.work>',
      to: email,
      subject: 'HIVE - Password Reset Request',
      html: `<div style="font-family:Arial,sans-serif;padding:24px;"><h1 style="color:#F59E0B;">HIVE</h1><h2>Reset Your Password</h2><p>Click below to reset your password. Link expires in 1 hour.</p><a href="${resetUrl}" style="display:inline-block;background:#F59E0B;color:white;padding:12px 30px;border-radius:8px;text-decoration:none;font-weight:bold;margin:20px 0;">Reset Password</a><p style="color:#999;font-size:12px;">If you did not request this, ignore this email.</p></div>`,
    });
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
      subject: 'Welcome to HIVE!',
      html: `<div style="font-family:Arial,sans-serif;padding:24px;"><h1 style="color:#F59E0B;">HIVE</h1><h2>Welcome, ${name}!</h2><p>Thanks for joining HIVE. Start exploring services or list your own today.</p><a href="https://inhive.work" style="display:inline-block;background:#F59E0B;color:white;padding:12px 30px;border-radius:8px;text-decoration:none;font-weight:bold;margin:20px 0;">Go to HIVE</a></div>`,
    });
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
      html: `<div style="font-family:Arial,sans-serif;padding:24px;"><h1 style="color:#F59E0B;">HIVE</h1><h2>Hey ${name}, verify your email</h2><p>Click below to verify your email and activate your account.</p><a href="${verifyUrl}" style="display:inline-block;background:#F59E0B;color:white;padding:12px 30px;border-radius:8px;text-decoration:none;font-weight:bold;margin:20px 0;">Verify My Email</a><p style="color:#999;font-size:12px;">This link expires in 24 hours.</p></div>`,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendPasswordResetEmail, sendWelcomeEmail, sendVerificationEmail };