const nodemailer = require("nodemailer");

/**
 * sendEmail - Utility to send emails via SMTP
 * 
 * Supports both real SMTP (configured via .env) and 
 * test accounts (Ethereal Email).
 */
const sendEmail = async (to, subject, text) => {
  let transporter;

  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

  // Check if real SMTP config exists in environment
  if (EMAIL_USER && EMAIL_PASS) {
    if (EMAIL_HOST) {
      // Custom SMTP
      transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT || 587,
        secure: EMAIL_PORT == 465,
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      });
    } else if (EMAIL_USER.includes("@gmail.com")) {
      // Default to Gmail Service
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      });
    } else {
      // Generic service guess if no host
      transporter = nodemailer.createTransport({
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      });
    }
  } else {
    // FALLBACK: Create a temporary test account (Ethereal Email)
    // ONLY IF the user hasn't provided any credentials
    console.log("-----------------------------------------");
    console.log("WARNING: NO EMAIL CREDENTIALS FOUND IN .ENV");
    console.log("Attempting to create Ethereal Test Account...");
    console.log("-----------------------------------------");
    
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (err) {
      console.error("FATAL: Failed to create Ethereal test account:", err.message);
      throw new Error("Email service is unavailable (No credentials and test account failed).");
    }
  }

  try {
    const info = await transporter.sendMail({
      from: `"UniVault System" <${EMAIL_USER || "no-reply@univault.com"}>`,
      to: to,
      subject: subject,
      text: text,
    });

    if (!EMAIL_USER) {
      console.log("-----------------------------------------");
      console.log("NOTICE: Using Ethereal Email (Test Account)");
      console.log("Email preview URL:", nodemailer.getTestMessageUrl(info));
      console.log("-----------------------------------------");
    } else {
      console.log(`Email successfully sent to: ${to}`);
    }

    return info;
  } catch (err) {
    console.error(`Email delivery failed to ${to}:`, err.message);
    throw err; // Re-throw to be caught by the controller
  }
};

module.exports = sendEmail;