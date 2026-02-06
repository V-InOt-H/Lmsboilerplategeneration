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
    console.log(`Email sent to ${options.to}`);
  } catch (error) {
    console.error('Email sending failed:', error);
    // In development, log the email content
    if (process.env.NODE_ENV === 'development') {
      console.log('Development Mode - Email Content:');
      console.log(mailOptions);
    }
  }
};

module.exports = { sendEmail };

