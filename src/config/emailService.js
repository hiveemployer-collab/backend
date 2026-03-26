const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'https://inhive.work'}/reset-password?token=${resetToken}`;
  try {
    await resend.emails.send({
      from: 'HIVE <noreply@inhive.work>',
      to: email,
      subject: 'HIVE - Password Reset Request',
      html: `<div style="font-family:Arial,sans-serif;padding:24px;">
        <h1 style="color:#F59E0B;">HIVE</h1>
        <h2>Reset Your Password</h2>
        <p>Click below to reset your password. Link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#F59E0B;color:white;padding:12px 30px;border-radius:8px;text-decoration:none;font-weight:bold;margin:20px 0;">Reset Password</a>
        <p style="color:#999;font-size:12px;">If you didn't request this, ignore this email.</p>
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