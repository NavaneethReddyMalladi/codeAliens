import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: `

        <!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f7fb;
      font-family: Arial, sans-serif;
    }

    .email-container {
      max-width: 600px;
      margin: 30px auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .header {
      background: #111827;
      color: white;
      text-align: center;
      padding: 30px 20px;
    }

    .header h1 {
      margin: 0;
      font-size: 28px;
      letter-spacing: 1px;
    }

    .content {
      padding: 40px 30px;
      text-align: center;
      color: #374151;
    }

    .content h2 {
      margin-bottom: 20px;
      color: #111827;
    }

    .content p {
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .otp-box {
        display: inline-block;
        background: #2563eb;
        color: white;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 6px;
        padding: 10px 24px;
        border-radius: 8px;
        margin: 15px 0;
    }

    .expiry {
      color: #dc2626;
      font-weight: 600;
      margin-top: 15px;
    }

    .footer {
      background: #f9fafb;
      padding: 20px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      border-top: 1px solid #e5e7eb;
    }

    .username {
      color: #2563eb;
      font-weight: bold;
    }

  </style>
</head>
<body>

  <div class="email-container">

    <div class="header">
      <h1>CodeAliens</h1>
    </div>

    <div class="content">
      <h2>Email Verification</h2>

      <p>
        Welcome to <strong>Code Aliens!</strong><br>
        You're one step away from starting your DSA journey.
      </p>

      <p>Please use the verification code below:</p>

      <div class="otp-box">
        ${otp}
      </div>

      <p class="expiry">
        This code will expire in 15 minutes.
      </p>

      <p>
        If you didn't request this email, you can safely ignore it.
      </p>
    </div>

    <div class="footer">
      Sent by <span class="username">arunKumar01</span><br>
      © CodeAliens
    </div>

  </div>

</body>
</html>
      `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.messageId);
    return true;

  } catch (error) {
    resizeBy.status(400).json({"msg":"Enter a valid email Id!!!"})
    console.error("Mail error:", error.message);
    return false;
  }
};

export {sendEmail};