// emailConfig.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // you can use any email service
  auth: {
    user: 'your-email@gmail.com', // your email
    pass: 'your-email-password', // your email password
  },
});

module.exports = transporter;
