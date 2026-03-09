const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  // Create a temporary test account
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"UniVault System" <no-reply@univault.com>',
    to: to,
    subject: subject,
    text: text,
  });

  // This URL lets you view the email in browser
  console.log("OTP email preview URL:", nodemailer.getTestMessageUrl(info));
};

module.exports = sendEmail;