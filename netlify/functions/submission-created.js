// Netlify automatically invokes a function named `submission-created` for
// every form submission to a Netlify-detected HTML form. We use it to forward
// referral-form submissions to hello@fwdhealth.com.au via Resend.
//
// Env var required: RESEND_API_KEY (set in Netlify → Project configuration →
// Environment variables, NOT in the repo).

const escapeHtml = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const fieldRow = (label, value) =>
  value
    ? `<tr><td style="padding:6px 12px 6px 0;color:#6b6e68;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(
        label,
      )}</td><td style="padding:6px 0;color:#1a1d1a;font-size:14px;">${escapeHtml(
        value,
      )}</td></tr>`
    : "";

export const handler = async (event) => {
  try {
    const payload = JSON.parse(event.body || "{}").payload || {};
    const formName = payload.form_name;
    const data = payload.data || {};

    // Only the referral form for now.
    if (formName !== "referral") {
      return { statusCode: 200, body: "ignored: not the referral form" };
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY env var not set");
      return { statusCode: 500, body: "RESEND_API_KEY missing" };
    }

    const subject = `New referral via fwdhealth.com.au — ${data.subject || "no subject"}`;

    // Look for an uploaded file URL. Netlify Forms returns file uploads as
    // either a string URL on the field or under a separate ordered_human_fields
    // structure. Both spots handled defensively.
    const fileFromData = data.referral_document;
    const fileFromHuman = Array.isArray(payload.ordered_human_fields)
      ? payload.ordered_human_fields.find((f) => f && f.name === "referral_document")
      : null;
    const fileUrl =
      (typeof fileFromData === "string" && fileFromData) ||
      (fileFromHuman && fileFromHuman.value) ||
      "";

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:640px;margin:0 auto;color:#1a1d1a;">
        <h2 style="font-size:20px;margin:0 0 18px;">New referral via <span style="color:#5e6b4d;">fwdhealth.com.au</span></h2>
        <table style="border-collapse:collapse;width:100%;margin-bottom:18px;">
          ${fieldRow("From", data.practitioner_name)}
          ${fieldRow("Practice", data.practice)}
          ${fieldRow("Email", data.practitioner_email)}
          ${fieldRow("Phone", data.practitioner_phone)}
          ${fieldRow("Service requested", data.service_requested || "Not specified")}
          ${fieldRow("Subject", data.subject)}
          ${fieldRow("Patient consent confirmed", data.patient_consent ? "Yes" : "No")}
          ${fileUrl ? `<tr><td style="padding:6px 12px 6px 0;color:#6b6e68;font-size:13px;vertical-align:top;">Attachment</td><td style="padding:6px 0;font-size:14px;"><a href="${escapeHtml(fileUrl)}" style="color:#5e6b4d;">Download referral document</a></td></tr>` : ""}
        </table>
        <div style="background:#f6f7f4;border-left:3px solid #5e6b4d;padding:14px 18px;border-radius:4px;">
          <p style="margin:0 0 8px;font-size:13px;color:#6b6e68;text-transform:uppercase;letter-spacing:0.1em;">Message</p>
          <p style="margin:0;white-space:pre-wrap;font-size:14px;line-height:1.55;">${escapeHtml(data.message || "(no message)")}</p>
        </div>
        <p style="font-size:12px;color:#8f8f8a;margin-top:24px;">
          Submitted via the <a href="https://fwdhealth.com.au/refer" style="color:#8f8f8a;">/refer</a> page.
          Full submission is also stored in the Netlify Forms dashboard.
        </p>
      </div>
    `;

    const text = [
      `New referral via fwdhealth.com.au`,
      ``,
      `From: ${data.practitioner_name || ""}`,
      `Practice: ${data.practice || ""}`,
      `Email: ${data.practitioner_email || ""}`,
      `Phone: ${data.practitioner_phone || ""}`,
      `Service requested: ${data.service_requested || "Not specified"}`,
      `Subject: ${data.subject || ""}`,
      `Patient consent: ${data.patient_consent ? "Yes" : "No"}`,
      fileUrl ? `Attachment: ${fileUrl}` : "",
      ``,
      `Message:`,
      data.message || "(no message)",
      ``,
      `--`,
      `Submitted via fwdhealth.com.au/refer. Full submission also in the Netlify Forms dashboard.`,
    ]
      .filter((line) => line !== "")
      .join("\n");

    const resendResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Forward Health Referrals <onboarding@resend.dev>",
        to: ["hello@fwdhealth.com.au"],
        reply_to: data.practitioner_email || undefined,
        subject,
        html,
        text,
      }),
    });

    if (!resendResp.ok) {
      const errBody = await resendResp.text();
      console.error("Resend send failed:", resendResp.status, errBody);
      return {
        statusCode: 502,
        body: `Resend failed: ${resendResp.status}`,
      };
    }

    return { statusCode: 200, body: "email sent" };
  } catch (err) {
    console.error("submission-created error:", err);
    return { statusCode: 500, body: "internal error" };
  }
};
