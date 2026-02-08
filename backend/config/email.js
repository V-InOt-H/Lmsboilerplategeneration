const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send email function
const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'Zoho Learning <noreply@zoholearning.com>',
    to: options.to,
    subject: options.subject,
    html: options.html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.to}`);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error.message);
    // In development, log the email content for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('Development Mode - Email Content:');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('Link in email:', options.html.match(/href="([^"]*)"/)?.[1]);
    }
    // Don't throw error - let the operation continue
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };

