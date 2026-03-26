const axios = require("axios");

// Check if Brevo is configured
if (!process.env.BREVO_API_KEY) {
  console.error("❌ BREVO_API_KEY is not set in environment variables");
  console.warn("⚠️ Email service will not work. Please add BREVO_API_KEY to .env");
  console.warn("⚠️ Get your API key from: https://app.brevo.com/settings/keys/api");
} else if (!process.env.BREVO_EMAIL) {
  console.error("❌ BREVO_EMAIL is not set in environment variables");
  console.warn("⚠️ Email service will not work. Please add BREVO_EMAIL to .env");
} else {
  console.log("✅ Brevo email service is configured and ready");
  console.log("📧 Email service initialized with Brevo API");
}

// ✅ Brevo API email sender
const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log('📧 [Brevo] Attempting to send email...');
    console.log('📧 [Brevo] To:', to);
    console.log('📧 [Brevo] Subject:', subject);
    console.log('📧 [Brevo] From:', process.env.BREVO_EMAIL);
    
    const res = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "TempChat Support",
          email: process.env.BREVO_EMAIL, // verified sender
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ [Brevo] Email sent successfully!");
    console.log("✅ [Brevo] Message ID:", res.data?.messageId || 'N/A');
    console.log("✅ [Brevo] Response:", JSON.stringify(res.data, null, 2));
    
    return res.data;
  } catch (err) {
    console.error("❌ [Brevo] Email sending failed!");
    console.error("❌ [Brevo] Error:", err.response?.data || err.message);
    console.error("❌ [Brevo] Status:", err.response?.status || 'N/A');
    console.error("❌ [Brevo] Full error:", JSON.stringify(err.response?.data, null, 2));
    throw err;
  }
};

module.exports = { sendEmail };
