const nodemailer = require("nodemailer");




// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     secure: true,
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });



const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",   //host (more reliable)
  port: 587,
  secure: false,            
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// ✅ verify connection on server start
const verifyTransporter = async () => {
    try {
        await transporter.verify();
        console.log("✅ SMTP Server is ready to send emails");
    } catch (error) {
        console.error("❌ SMTP Connection Error:", {
            message: error.message,
            stack: error.stack,
        });
    }
};

verifyTransporter();

module.exports = transporter;