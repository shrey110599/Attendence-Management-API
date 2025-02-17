const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, otp) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // Secure SSL port
      secure: true, // Use SSL
      auth: {
        user: "faizanpathanaipl@gmail.com",
        pass: "wipc wkqs srob zgyz", // Gmail App Password
      },
      tls: {
        rejectUnauthorized: false, // ✅ Ignores self-signed SSL issue
      },
    });

    // HTML Email Content
    const emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://aark.co.in/assets/img/logo/aark_logo-blue.png" alt="Aark Infosoft Logo" style="max-width: 200px;">
            </div>
            <h2 style="color: #0056b3; text-align: left;">Aark Infosoft - Password Reset Request</h2>
            <p>Dear User,</p>
            <p>We received a request to reset your password. Use the OTP below to proceed with resetting your password:</p>
            <div style="text-align: left; font-size: 24px; font-weight: bold; color: #d9534f; margin: 10px 0;">
                ${otp}
            </div>
            <p><strong>Note:</strong> This OTP is valid for only 5 minutes. If you did not request this, please ignore this email.</p>
            <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
            <p style="font-size: 14px; color: #555; text-align: left;">This email was sent by Aark Infosoft. Please do not reply to this email.</p>
        </div>
    `;

    await transporter.sendMail({
      from: '"Aark Infosoft"',
      to,
      subject: "Aark Infosoft - Forgot Your Password",
      html: emailHtml, // Send email in HTML format
    });
};

module.exports = sendEmail;
