const { Resend } = require('resend');

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Verify API key on server start
const verifyResend = () => {
  if (!process.env.RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY is not set in environment variables");
    console.warn("⚠️ Email service will not work. Please add RESEND_API_KEY to .env");
  } else {
    console.log("✅ Resend email service is configured and ready");
    console.log("📧 Email service initialized with Resend");
  }
};

verifyResend();

module.exports = resend;
