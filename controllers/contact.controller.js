const resend = require("../services/mail.service");

/**
 * Send contact support message via email using Resend
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

    // Modern professional email template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Support Request</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header with NextChat Branding -->
                <tr>
                  <td style="background: linear-gradient(135deg, #000000 0%, #434343 100%); padding: 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                      NextChat
                    </h1>
                    <p style="margin: 8px 0 0 0; color: #e0e0e0; font-size: 14px; font-weight: 500;">
                      Contact Support Request
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    
                    <!-- Alert Badge -->
                    <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 12px 16px; margin-bottom: 30px; border-radius: 6px;">
                      <p style="margin: 0; color: #1e40af; font-size: 14px; font-weight: 600;">
                        📩 New support request received
                      </p>
                    </div>

                    <!-- User Information Card -->
                    <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                      <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 18px; font-weight: 600;">
                        Contact Information
                      </h2>
                      
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 8px 0;">
                            <span style="color: #6b7280; font-size: 14px; font-weight: 500;">Name:</span>
                          </td>
                          <td style="padding: 8px 0; text-align: right;">
                            <span style="color: #111827; font-size: 14px; font-weight: 600;">${name}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; border-top: 1px solid #e5e7eb;">
                            <span style="color: #6b7280; font-size: 14px; font-weight: 500;">Email:</span>
                          </td>
                          <td style="padding: 8px 0; text-align: right; border-top: 1px solid #e5e7eb;">
                            <a href="mailto:${email}" style="color: #3b82f6; font-size: 14px; font-weight: 600; text-decoration: none;">${email}</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; border-top: 1px solid #e5e7eb;">
                            <span style="color: #6b7280; font-size: 14px; font-weight: 500;">Date:</span>
                          </td>
                          <td style="padding: 8px 0; text-align: right; border-top: 1px solid #e5e7eb;">
                            <span style="color: #111827; font-size: 14px; font-weight: 600;">${timestamp}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; border-top: 1px solid #e5e7eb;">
                            <span style="color: #6b7280; font-size: 14px; font-weight: 500;">Source:</span>
                          </td>
                          <td style="padding: 8px 0; text-align: right; border-top: 1px solid #e5e7eb;">
                            <span style="background-color: #000000; color: #ffffff; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">NextChat App</span>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <!-- Message Card -->
                    <div style="background-color: #ffffff; border: 2px solid #e5e7eb; border-radius: 8px; padding: 24px;">
                      <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 18px; font-weight: 600;">
                        Message
                      </h2>
                      <div style="color: #374151; font-size: 15px; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word;">
${message}
                      </div>
                    </div>

                    <!-- Quick Reply Button -->
                    <div style="text-align: center; margin-top: 30px;">
                      <a href="mailto:${email}?subject=Re: Support Request from NextChat" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 600; transition: background-color 0.2s;">
                        Reply to ${name}
                      </a>
                    </div>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 24px 30px; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; color: #6b7280; font-size: 13px; text-align: center; line-height: 1.5;">
                      This is an automated message from <strong style="color: #111827;">NextChat Support System</strong><br>
                      Please respond to this request within 24 hours
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Send email using Resend
    const supportEmail = process.env.SUPPORT_EMAIL || process.env.EMAIL_USER;
    
    await resend.emails.send({
      from: 'NextChat Support <onboarding@resend.dev>',
      to: supportEmail,
      subject: `🔔 New Support Request from ${name} - NextChat`,
      html: emailHtml,
      reply_to: email,
    });

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully. We'll get back to you soon!",
    });

  } catch (error) {
    console.error("Contact form submission error:", {
      error: error.message,
      name: error.name,
      timestamp: new Date().toISOString(),
      userEmail: req.body?.email || "unknown",
    });

    let errorMessage = "Failed to send message. Please try again later.";
    
    if (error.message?.includes('API key')) {
      errorMessage = "Email service is not configured. Please contact support.";
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
