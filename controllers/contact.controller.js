const { sendEmail } = require("../services/mail.service");

/**
 * Send contact support message via email using Brevo
 * @route POST /api/contact
 * @access Public
 */
const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log('📧 [Contact Support] Processing submission...');
    console.log('📧 [Contact Support] From:', name, '<' + email + '>');
    console.log('📧 [Contact Support] Message length:', message.length, 'characters');

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
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TempChat Support Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5; color: #000000; -webkit-font-smoothing: antialiased;">
  
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 60px 20px;">
    <tr>
      <td align="center">
        
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #000000; border-radius: 8px; overflow: hidden;">
          
          <tr>
            <td style="padding: 32px 40px; border-bottom: 1px solid #eeeeee;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: #000000;">
                      TempChat
                    </div>
                  </td>
                  <td align="right">
                    <div style="display: inline-block; border: 1px solid #000000; color: #000000; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">
                      ● New Request
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px;">
              
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 36px;">
                <tr>
                  <td width="50%" valign="top" style="padding-bottom: 24px;">
                    <div style="font-size: 11px; font-weight: 700; color: #777777; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                      Sender Name
                    </div>
                    <div style="font-size: 15px; font-weight: 600; color: #000000;">
                      ${name}
                    </div>
                  </td>
                  <td width="50%" valign="top" style="padding-bottom: 24px;">
                    <div style="font-size: 11px; font-weight: 700; color: #777777; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                      Time Received
                    </div>
                    <div style="font-size: 15px; font-weight: 600; color: #000000;">
                      ${timestamp}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" valign="top">
                    <div style="font-size: 11px; font-weight: 700; color: #777777; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                      Email Address
                    </div>
                    <div>
                      <a href="mailto:${email}" style="font-size: 15px; font-weight: 600; color: #000000; text-decoration: underline;">
                        ${email}
                      </a>
                    </div>
                  </td>
                </tr>
              </table>

              <div style="margin-bottom: 40px;">
                <div style="font-size: 11px; font-weight: 700; color: #777777; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                  Message Content
                </div>
                <div style="border-left: 3px solid #000000; padding-left: 16px; font-size: 15px; line-height: 1.6; color: #333333; white-space: pre-wrap;">${message}</div>
              </div>

              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <a href="mailto:${email}?subject=Re: TempChat Support - ${name}" style="display: block; width: 100%; text-align: center; background-color: #000000; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 16px 0; border-radius: 6px;">
                      Reply to User
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr>
            <td style="background-color: #ffffff; padding: 20px 40px; border-top: 1px solid #eeeeee; text-align: center;">
              <div style="font-size: 12px; color: #777777; line-height: 1.5;">
                Automated route via TempChat App • ID: ${Math.random().toString(36).substr(2, 8).toUpperCase()}
              </div>
            </td>
          </tr>

        </table>

        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; margin-top: 24px;">
          <tr>
            <td align="center">
              <a href="#" style="font-size: 13px; color: #000000; text-decoration: underline; font-weight: 500;">
                View in Admin Panel
              </a>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

    // Send email using Brevo
    const supportEmail = process.env.SUPPORT_EMAIL || "atech0840@gmail.com";

    console.log('📧 [Contact Support] Sending to support email:', supportEmail);

    await sendEmail({
      to: supportEmail,
      subject: `🔔 New Support Request from ${name} - TempChat`,
      html: emailHtml,
    });

    console.log('✅ [Contact Support] Email sent successfully to:', supportEmail);

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully. We'll get back to you soon!",
    });

  } catch (error) {
    console.error("❌ [Contact Support] Submission failed!");
    console.error("❌ [Contact Support] Error:", {
      message: error.message,
      name: error.name,
      timestamp: new Date().toISOString(),
      userEmail: req.body?.email || "unknown",
      brevoResponse: error.response?.data || null,
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
