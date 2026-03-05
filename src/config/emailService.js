// FILE: src/config/emailService.js

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
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f59e0b; color: white; padding: 20px; text-align: center; border-radius: 12px 12px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; }
            .button { display: inline-block; background-color: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🐝 HIVE SERVICES</h1>
            </div>
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>Hi there,</p>
              <p>You requested to reset your password for your HIVE account. Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666;">${resetUrl}</p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            </div>
            <div class="footer">
              <p>© 2025 HIVE Services. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('Password reset email sent to:', email);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendPasswordResetEmail };