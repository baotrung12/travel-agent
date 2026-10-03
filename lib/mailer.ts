import nodemailer from "nodemailer";

// SMTP settings come from env; when they're missing, sending is skipped (requests are still saved).
function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const port = Number(SMTP_PORT) || 587;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export type ContactEmail = {
  name: string;
  phone: string;
  email: string;
  message?: string | null;
  tourTitle?: string | null;
};

// Returns true when the notification was sent.
export async function sendContactNotification(contact: ContactEmail): Promise<boolean> {
  const transport = getTransport();
  // Comma-separated list of staff inboxes, e.g. "sales@edutour.vn, owner@gmail.com"
  const to = process.env.CONTACT_EMAIL_TO?.split(",").map((v) => v.trim()).filter(Boolean);
  if (!transport || !to?.length) {
    console.warn("Contact email not sent: SMTP_HOST/SMTP_USER/SMTP_PASS/CONTACT_EMAIL_TO not configured");
    return false;
  }

  const rows: [string, string][] = [
    ["Họ và tên", contact.name],
    ["Số điện thoại", contact.phone],
    ["Email", contact.email],
    ...(contact.tourTitle ? [["Tour quan tâm", contact.tourTitle] as [string, string]] : []),
    ["Nội dung", contact.message || "—"],
  ];

  await transport.sendMail({
    from: process.env.SMTP_FROM || `"Edutour Website" <${process.env.SMTP_USER}>`,
    to,
    replyTo: contact.email,
    subject: `[Liên hệ mới] ${contact.name} – ${contact.phone}${contact.tourTitle ? ` – ${contact.tourTitle}` : ""}`,
    text: rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
    html: `
      <h2 style="font-family:sans-serif;color:#642267">Yêu cầu liên hệ mới từ website</h2>
      <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
        ${rows.map(([label, value]) => `
          <tr>
            <td style="padding:6px 16px 6px 0;color:#64748b;vertical-align:top;white-space:nowrap">${label}</td>
            <td style="padding:6px 0;color:#0f172a;white-space:pre-line">${escapeHtml(value)}</td>
          </tr>`).join("")}
      </table>`,
  });
  return true;
}
