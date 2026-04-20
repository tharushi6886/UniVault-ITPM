/**
 * getOtpTemplate - Generates a professional HTML email for OTP verification
 * @param {string} otp - The 6-digit OTP code
 * @param {string} name - The user's name
 * @param {string} type - The type of verification ('registration' or 'password reset')
 * @returns {string} - HTML email string
 */
const getOtpTemplate = (otp, name, type = "registration") => {
  const isRegistration = type === "registration";
  const title = isRegistration ? "Verify Your Account" : "Reset Your Password";
  const actionText = isRegistration 
    ? "Thank you for joining UniVault. Use the code below to complete your registration." 
    : "We received a request to reset your password. Use the code below to proceed.";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          background-color: #F8FAFC; 
          margin: 0; 
          padding: 0; 
          -webkit-font-smoothing: antialiased;
        }
        .container { 
          max-width: 600px; 
          margin: 40px auto; 
          background: #ffffff; 
          border-radius: 24px; 
          overflow: hidden; 
          box-shadow: 0 10px 30px rgba(30, 58, 138, 0.05);
          border: 1px solid #E2E8F0;
        }
        .header { 
          background: linear-gradient(135deg, #4F46E9 0%, #8B5CF6 100%); 
          padding: 40px 20px; 
          text-align: center; 
          color: white;
        }
        .logo { 
          font-size: 28px; 
          font-weight: 800; 
          letter-spacing: -1px; 
          margin-bottom: 8px;
          display: block;
        }
        .header h1 { 
          margin: 0; 
          font-size: 20px; 
          font-weight: 500; 
          opacity: 0.9;
        }
        .content { 
          padding: 40px 30px; 
          text-align: center; 
          color: #1E293B;
        }
        .greeting { 
          font-size: 18px; 
          font-weight: 600; 
          margin-bottom: 16px; 
        }
        .description { 
          font-size: 15px; 
          line-height: 1.6; 
          color: #64748B; 
          margin-bottom: 32px; 
        }
        .otp-container { 
          background: #F1F5F9; 
          border-radius: 16px; 
          padding: 24px; 
          margin: 0 auto 32px; 
          display: inline-block;
          min-width: 200px;
        }
        .otp-code { 
          font-size: 36px; 
          font-weight: 800; 
          letter-spacing: 8px; 
          color: #4F46E9; 
          margin: 0;
        }
        .expiry { 
          font-size: 13px; 
          color: #94A3B8; 
          margin-top: 12px;
          font-weight: 500;
        }
        .footer { 
          padding: 30px; 
          text-align: center; 
          border-top: 1px solid #F1F5F9; 
          background: #FCFDFF;
        }
        .footer p { 
          font-size: 13px; 
          color: #94A3B8; 
          margin: 0 0 10px; 
          line-height: 1.5;
        }
        .footer a { 
          color: #4F46E9; 
          text-decoration: none; 
          font-weight: 600; 
        }
        .warning {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px dashed #E2E8F0;
          font-size: 12px !important;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <span class="logo">UNIVAULT</span>
          <h1>${title}</h1>
        </div>
        <div class="content">
          <div class="greeting">Hello, ${name}!</div>
          <div class="description">
            ${actionText}
          </div>
          <div class="otp-container">
            <div class="otp-code">${otp}</div>
            <div class="expiry">Valid for 10 minutes</div>
          </div>
          <div class="footer">
            <p>If you did not request this email, you can safely ignore it.</p>
            <p>&copy; ${new Date().getFullYear()} UniVault. All rights reserved.</p>
            <p class="warning">For security reasons, never share this code with anyone.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = { getOtpTemplate };
