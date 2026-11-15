import nodemailer from "nodemailer";

interface Mail {
  to: string;
  subject: string;
  html: string;
  text: string;
}

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

export async function sendEmail({ to, subject, html, text }: Mail) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    if (process.env.NODE_ENV !== "production") {
      // Handy for testing: the link is in the text
      console.log(`\n[email not configured]\nTo: ${to}\nSubject: ${subject}\n\n${text}\n`);
    } else {
      console.error("Email is not configured. Set SMTP_USER and SMTP_PASS.");
    }
    return;
  }

  try {
    transporter ??= nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
    await transporter.sendMail({ from: `"HueEstate" <${user}>`, to, subject, html, text });
  } catch (e) {
    console.error("Sending email failed:", e);
  }
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function resetPasswordEmail(name: string, url: string) {
  const first = name.trim().split(" ")[0] || "there";

  return {
    subject: "Reset your HueEstate password",
    text: `Hi ${first},\n\nUse this link to choose a new password. It expires in 1 hour:\n${url}\n\nIf you didn't ask for this, you can ignore this email and your password will stay the same.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#243D35">
        <h2 style="margin:0 0 16px">Reset your password</h2>
        <p>Hi ${esc(first)},</p>
        <p>We received a request to reset your HueEstate password. This link works for 1 hour.</p>
        <p style="margin:28px 0">
          <a href="${esc(url)}" style="background:#243D35;color:#ffffff;padding:14px 28px;border-radius:6px;text-decoration:none;display:inline-block">
            Choose a new password
          </a>
        </p>
        <p style="font-size:13px;color:#666">If you didn't ask for this, you can ignore this email and your password will stay the same.</p>
      </div>`,
  };
}