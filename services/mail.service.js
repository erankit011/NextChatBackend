const nodemailer = require("nodemailer");

// Create transporter with better error handling for production
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    // Do not fail on invalid certs (for some hosting providers)
    rejectUnauthorized: false
  },
  // Connection timeout
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Verify connection on server start
const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP Server is ready to send emails");
  } catch (error) {
    console.error("❌ SMTP Connection Error:", {
      message: error.message,
      code: error.code,
      command: error.command,
    });
    console.warn("⚠️ Email service may not work. Check EMAIL_USER and EMAIL_PASS in .env");
  }
};

// Only verify in production, skip in development to avoid delays
if (process.env.NODE_ENV === 'production') {
  verifyTransporter();
}

module.exports = transporter;