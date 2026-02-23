const { Resend } = require('resend');

// Initialize Resend with API key (with fallback for missing key)
const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.error("❌ RESEND_API_KEY is not set in environment variables");
  console.warn("⚠️ Email service will not work. Please add RESEND_API_KEY to .env");
  console.warn("⚠️ Get your API key from: https://resend.com/api-keys");
  
  // Export a dummy object to prevent crashes
  module.exports = {
    emails: {
      send: async () => {
        throw new Error("Email service not configured. Please set RESEND_API_KEY environment variable.");
      }
    }
  };
} else {
  const resend = new Resend(apiKey);
  console.log("✅ Resend email service is configured and ready");
  console.log("📧 Email service initialized with Resend");
  module.exports = resend;
}
