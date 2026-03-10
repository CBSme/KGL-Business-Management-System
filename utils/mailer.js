require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function sendResetEmail(toEmail, fullName, resetUrl) {
  await transporter.sendMail({
    from: `"KGL System" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "KGL System — Password Reset Request",
    html: `
      <div style="font-family:Poppins,Arial,sans-serif;max-width:480px;margin:0 auto;background:#f4f6f4;padding:32px 16px">
        <div style="background:#fff;border-radius:16px;padding:32px;box-shadow:0 4px 16px rgba(0,0,0,0.08)">
          <div style="margin-bottom:24px">
            <div style="font-weight:700;font-size:1rem;color:#1a2e1a">🌱 KGL System</div>
            <div style="font-size:0.72rem;color:#6b7c6b">Karibu Groceries Ltd</div>
          </div>

          <h2 style="color:#1a2e1a;font-size:1.2rem;margin:0 0 8px">Password Reset Request</h2>
          <p style="color:#3a4a3a;font-size:0.88rem;line-height:1.6;margin:0 0 24px">
            Hi <strong>${fullName}</strong>,<br><br>
            We received a request to reset your KGL System password. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
          </p>

          <a href="${resetUrl}" style="display:block;text-align:center;background:linear-gradient(135deg,#1a6b3a,#27a85a);color:#fff;text-decoration:none;padding:14px 24px;border-radius:10px;font-weight:600;font-size:0.9rem;margin-bottom:24px">
            Reset My Password
          </a>

          <p style="color:#6b7c6b;font-size:0.78rem;line-height:1.6;margin:0;border-top:1px solid #eee;padding-top:16px">
            If you did not request this, you can safely ignore this email. Your password will not change.<br><br>
            For security, this link will expire in 1 hour.
          </p>
        </div>
      </div>
    `,
  });
}

module.exports = { sendResetEmail };
