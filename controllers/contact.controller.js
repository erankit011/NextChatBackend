const transporter = require("../services/mail.service");

/**
 * Send contact support message via email
 * @route POST /api/contact
 * @access Public
 */
const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Generate timestamp for email
    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    // Generate HTML email content using template from design
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Support Request</h2>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Date:</strong> ${timestamp}</p>
        </div>
        
        <div style="background: #fff; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        
        <p style="color: #666; font-size: 12px;">
          This is an automated message from NextChat Contact Support System.
        </p>
      </div>
    `;

    // Send email to configured support address
    const supportEmail = process.env.SUPPORT_EMAIL || process.env.EMAIL_USER;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: supportEmail,
      subject: `Contact Support Request from ${name}`,
      html: emailHtml,
      replyTo: email, // Allow easy reply to the user
    });

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully. We'll get back to you soon!",
    });

  } catch (error) {
    // Log error with context for debugging
    console.error("Contact form submission error:", {
      error: error.message,
      code: error.code,
      command: error.command,
      timestamp: new Date().toISOString(),
      userEmail: req.body?.email || "unknown",
    });

    // Provide user-friendly error message
    let errorMessage = "Failed to send message. Please try again later.";
    
    if (error.code === 'EAUTH') {
      errorMessage = "Email service authentication failed. Please contact support.";
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      errorMessage = "Email service is temporarily unavailable. Please try again later.";
    }

    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
};

module.exports = {
  sendContactMessage,
};
