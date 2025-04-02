// backend/utils/emailUtils.js
const nodemailer = require("nodemailer");

const sendNotificationEmails = async ({
  hostEmail,
  hostName,
  visitorEmail,
  visitorName,
  purpose,
}) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // Secure SSL port
    secure: true, // Use SSL
    auth: {
      user: "faizanpathanaipl@gmail.com",
      pass: "wipc wkqs srob zgyz", // Gmail App Password
    },
    tls: {
      rejectUnauthorized: false, // Ignores self-signed SSL issue
    },
  });

  // Classic Host Email Content
  const hostEmailHtml = `
    <div style="font-family: 'Georgia', serif; max-width: 650px; margin: 0 auto; background: linear-gradient(to bottom, #f8f9fa, #ffffff); border: 2px solid #1b2f5b; border-radius: 10px; padding: 30px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 25px;">
        <img src="https://ci3.googleusercontent.com/meips/ADKq_NaZL2unybpVqFARil7_UGoNBmowbtsN2UMs7hFvI2YS_B-AtNLbZEHrLxD_g-kXi2mfA4iCyqdwPR8fhI-_Cp33Vp1WDjuaPnomUQ=s0-d-e1-ft#https://aark.co.in/assets/img/logo/aark_logo-blue.png" alt="Aark Infosoft Logo" style="max-width: 180px; border-radius: 5px;">
      </div>
      <h2 style="color: #1b2f5b; font-size: 24px; text-align: center; margin-bottom: 20px; border-bottom: 1px solid #1b2f5b; padding-bottom: 10px;">New Visitor Notification</h2>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">Dear ${hostName},</p>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">We are pleased to inform you that a visitor has been scheduled to meet with you at Aark Infosoft:</p>
      <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #1b2f5b; border-bottom: 1px solid #ddd;">Visitor Name:</td>
          <td style="padding: 8px; color: #555; border-bottom: 1px solid #ddd;">${visitorName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #1b2f5b; border-bottom: 1px solid #ddd;">Purpose:</td>
          <td style="padding: 8px; color: #555; border-bottom: 1px solid #ddd;">${purpose}</td>
        </tr>
      </table>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">Kindly prepare to welcome your guest. Should you require any assistance, please contact our administration team.</p>
      <hr style="border: 0; height: 1px; background: #1b2f5b; margin: 25px 0;">
      <p style="font-size: 12px; color: #777; text-align: center;">This is an automated message from Aark Infosoft. Please do not reply directly to this email.</p>
    </div>
  `;

  // Classic Visitor Email Content
  const visitorEmailHtml = `
    <div style="font-family: 'Georgia', serif; max-width: 650px; margin: 0 auto; background: linear-gradient(to bottom, #f8f9fa, #ffffff); border: 2px solid #1b2f5b; border-radius: 10px; padding: 30px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 25px;">
        <img src="https://ci3.googleusercontent.com/meips/ADKq_NaZL2unybpVqFARil7_UGoNBmowbtsN2UMs7hFvI2YS_B-AtNLbZEHrLxD_g-kXi2mfA4iCyqdwPR8fhI-_Cp33Vp1WDjuaPnomUQ=s0-d-e1-ft#https://aark.co.in/assets/img/logo/aark_logo-blue.png" alt="Aark Infosoft Logo" style="max-width: 180px; border-radius: 5px;">
      </div>
      <h2 style="color: #1b2f5b; font-size: 24px; text-align: center; margin-bottom: 20px; border-bottom: 1px solid #1b2f5b; padding-bottom: 10px;">Welcome to Aark Infosoft</h2>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">Dear ${visitorName},</p>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">It is our pleasure to welcome you to Aark Infosoft. Below are the details of your upcoming visit:</p>
      <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #1b2f5b; border-bottom: 1px solid #ddd;">Purpose:</td>
          <td style="padding: 8px; color: #555; border-bottom: 1px solid #ddd;">${purpose}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #1b2f5b; border-bottom: 1px solid #ddd;">Host:</td>
          <td style="padding: 8px; color: #555; border-bottom: 1px solid #ddd;">${hostName}</td>
        </tr>
      </table>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">We kindly request your punctual arrival. Should you need any assistance, please do not hesitate to contact us.</p>
      <hr style="border: 0; height: 1px; background: #1b2f5b; margin: 25px 0;">
      <p style="font-size: 12px; color: #777; text-align: center;">This is an automated message from Aark Infosoft. Please do not reply directly to this email.</p>
    </div>
  `;

  // Send email to host
  await transporter.sendMail({
    from: '"Aark Infosoft" <faizanpathanaipl@gmail.com>',
    to: hostEmail,
    subject: "Aark Infosoft - New Visitor Notification",
    html: hostEmailHtml,
  });

  // Send email to visitor
  await transporter.sendMail({
    from: '"Aark Infosoft" <faizanpathanaipl@gmail.com>',
    to: visitorEmail,
    subject: "Welcome to Aark Infosoft - Visit Confirmation",
    html: visitorEmailHtml,
  });
};

module.exports = { sendNotificationEmails };