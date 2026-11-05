// Stripe webhook handler for completed gift card checkouts.
//
// Flow on checkout.session.completed:
//   1. Verify signature with STRIPE_WEBHOOK_SECRET
//   2. Skip anything that isn't a gift_card_v1 session
//   3. Idempotency check against Netlify Blobs
//   4. Generate a unique redemption code + expiry date
//   5. Render a branded PDF gift card
//   6. Store record in Netlify Blobs
//   7. Email the gift card:
//        - to the recipient if deliveryMethod === email-friend
//        - to the buyer if deliveryMethod === email-me-to-print
//      BCC hello@fwdhealth.com.au on every send so reception sees it.
//
// Env vars required:
//   STRIPE_SECRET_KEY       — used only for the Stripe client ctor (not for verify)
//   STRIPE_WEBHOOK_SECRET   — webhook endpoint signing secret (whsec_...)
//   RESEND_API_KEY          — Resend API key for email delivery
//   RESEND_FROM_EMAIL       — optional, defaults to onboarding@resend.dev
//                             (set to e.g. "Forward Health <gifts@fwdhealth.com.au>"
//                             once your domain is verified in Resend)
//
// Netlify webhook URL after deploy:
//   https://www.fwdhealth.com.au/.netlify/functions/stripe-webhook

import Stripe from "stripe";
import PDFDocument from "pdfkit";
import crypto from "node:crypto";
import { getStore } from "./_blobs.js";
import {
  generateGiftCardCode,
  computeExpiryISO,
  formatAud,
  formatDatePretty,
  getServiceById,
} from "../../src/data/gift-cards.js";
import { getLogoBuffer } from "../../src/data/gift-card-logo.js";

// Brand colours (match Tailwind theme in src/styles/global.css)
const COLOR = {
  sage600: "#5e6b4d",
  sage700: "#4a5540",
  sage50: "#f3f5ef",
  tan600: "#9b8155",
  tan700: "#7b6540",
  tan100: "#eadfc9",
  cream50: "#faf7ef",
  charcoal: "#1a1d1a",
  stone: "#6b6e68",
};

const escapeHtml = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

// Pdfkit uses Points (72 per inch). We build at A5 landscape (595 × 420pt).
async function buildGiftCardPdf({
  code,
  serviceName,
  serviceShort,
  priceCents,
  recipientName,
  buyerName,
  personalMessage,
  issuedISO,
  expiryISO,
}) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: [595, 420],
        margin: 0,
        info: {
          Title: `Forward Health Gift Card ${code}`,
          Author: "Forward Health",
          Subject: `Gift card for ${recipientName}`,
        },
      });

      const chunks = [];
      doc.on("data", (c) => chunks.push(c));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Background: cream
      doc.rect(0, 0, 595, 420).fill(COLOR.cream50);

      // Sage accent panel on the left
      doc.rect(0, 0, 36, 420).fill(COLOR.sage600);

      // Logo (top-right). Source is 406×156 — place at 130×50pt (aspect-preserving).
      try {
        const logoBuf = getLogoBuffer();
        doc.image(logoBuf, 395, 32, { width: 140 });
      } catch (e) {
        // If the logo fails to load for any reason, degrade gracefully with a text wordmark.
        doc
          .fillColor(COLOR.sage700)
          .font("Times-Bold")
          .fontSize(16)
          .text("Forward Health", 440, 40);
      }

      // Top eyebrow
      doc
        .fillColor(COLOR.tan700)
        .font("Helvetica-Bold")
        .fontSize(9)
        .text("SUNSHINE COAST  ·  MORETON BAY", 60, 44, {
          characterSpacing: 2.5,
        });

      // Headline
      doc
        .fillColor(COLOR.charcoal)
        .font("Times-Bold")
        .fontSize(34)
        .text("The gift of health.", 60, 66);

      // Service label
      doc
        .fillColor(COLOR.tan700)
        .font("Helvetica-Bold")
        .fontSize(8)
        .text("GIFT", 60, 128, { characterSpacing: 2 });

      doc
        .fillColor(COLOR.sage700)
        .font("Times-Bold")
        .fontSize(22)
        .text(serviceShort, 60, 142, { width: 475 });

      // Value / description split
      doc
        .fillColor(COLOR.stone)
        .font("Helvetica")
        .fontSize(10)
        .text(serviceName, 60, 182, { width: 475 });

      // Horizontal divider
      doc
        .moveTo(60, 212)
        .lineTo(535, 212)
        .lineWidth(0.5)
        .strokeColor(COLOR.sage600)
        .stroke();

      // Recipient block
      doc
        .fillColor(COLOR.tan700)
        .font("Helvetica-Bold")
        .fontSize(8)
        .text("FOR", 60, 226, { characterSpacing: 2 });
      doc
        .fillColor(COLOR.charcoal)
        .font("Times-Italic")
        .fontSize(18)
        .text(recipientName, 60, 240, { width: 240 });

      // From block
      doc
        .fillColor(COLOR.tan700)
        .font("Helvetica-Bold")
        .fontSize(8)
        .text("FROM", 320, 226, { characterSpacing: 2 });
      doc
        .fillColor(COLOR.charcoal)
        .font("Times-Italic")
        .fontSize(18)
        .text(buyerName, 320, 240, { width: 215 });

      // Personal message (if present)
      if (personalMessage && personalMessage.trim()) {
        doc
          .fillColor(COLOR.stone)
          .font("Helvetica-Oblique")
          .fontSize(10)
          .text(`"${personalMessage.trim()}"`, 60, 278, { width: 475, align: "left" });
      }

      // Code panel (bottom)
      doc.rect(0, 340, 595, 80).fill(COLOR.sage700);
      doc
        .fillColor("#dfe6d6")
        .font("Helvetica-Bold")
        .fontSize(8)
        .text("REDEMPTION CODE", 60, 354, { characterSpacing: 2 });
      doc
        .fillColor("#ffffff")
        .font("Courier-Bold")
        .fontSize(22)
        .text(code, 60, 368);

      // Value right side
      doc
        .fillColor("#dfe6d6")
        .font("Helvetica-Bold")
        .fontSize(8)
        .text("VALUE", 440, 354, { characterSpacing: 2 });
      doc
        .fillColor("#ffffff")
        .font("Times-Bold")
        .fontSize(22)
        .text(formatAud(priceCents), 440, 368);

      // Footer line
      doc
        .fillColor("#aebb9b")
        .font("Helvetica")
        .fontSize(8)
        .text(
          `Valid until ${formatDatePretty(expiryISO)}  ·  Issued ${formatDatePretty(issuedISO)}  ·  fwdhealth.com.au  ·  0420 522 558`,
          60,
          400,
          { width: 475, align: "left" },
        );

      doc.end();
    } catch (e) {
      reject(e);
    }
  });
}

function emailSubjectAndBody({
  code,
  deliveryMethod,
  serviceName,
  serviceShort,
  priceCents,
  buyerName,
  recipientName,
  personalMessage,
  issuedISO,
  expiryISO,
}) {
  const toFriend = deliveryMethod === "email-friend";

  const subject = toFriend
    ? `${recipientName.split(" ")[0] || "You"}, ${buyerName.split(" ")[0] || "someone"} has sent you a Forward Health gift card`
    : `Your Forward Health gift card for ${recipientName}`;

  const openingLine = toFriend
    ? `Hi ${escapeHtml(recipientName.split(" ")[0] || recipientName)}, <strong>${escapeHtml(buyerName)}</strong> has sent you a Forward Health gift card. The PDF is attached, and your redemption code is below.`
    : `Hi ${escapeHtml(buyerName.split(" ")[0] || buyerName)}, here's your Forward Health gift card for <strong>${escapeHtml(recipientName)}</strong>. The PDF is attached — print it, pop it in a card, hand it over. The redemption code is below.`;

  const messageBlock =
    personalMessage && personalMessage.trim()
      ? `
        <tr><td style="padding:20px 0 4px;">
          <p style="margin:0;color:${COLOR.tan700};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;font-weight:600;">A note from ${escapeHtml(buyerName)}</p>
          <p style="margin:6px 0 0;font-size:15px;line-height:1.55;color:${COLOR.charcoal};font-style:italic;">"${escapeHtml(personalMessage.trim())}"</p>
        </td></tr>
      `
      : "";

  const html = `
    <div style="background:${COLOR.cream50};padding:36px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:${COLOR.charcoal};">
      <table role="presentation" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e4e8dc;" cellpadding="0" cellspacing="0" width="100%">
        <tr><td style="padding:28px 32px 10px;background:${COLOR.sage50};border-bottom:1px solid #e4e8dc;">
          <p style="margin:0;color:${COLOR.tan700};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;font-weight:600;">Forward Health</p>
          <h1 style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-weight:700;color:${COLOR.charcoal};font-size:28px;line-height:1.15;">The gift of health.</h1>
        </td></tr>

        <tr><td style="padding:24px 32px 6px;">
          <p style="margin:0;color:${COLOR.stone};font-size:15px;line-height:1.55;">${openingLine}</p>
        </td></tr>

        <tr><td style="padding:16px 32px 0;">
          <div style="background:${COLOR.sage50};border:1px solid #d4ddc5;border-radius:14px;padding:22px;">
            <p style="margin:0;color:${COLOR.tan700};font-size:10px;letter-spacing:0.18em;text-transform:uppercase;font-weight:600;">Gift</p>
            <p style="margin:6px 0 0;font-family:Georgia,'Times New Roman',serif;color:${COLOR.sage700};font-size:22px;font-weight:700;line-height:1.1;">${escapeHtml(serviceShort)}</p>
            <p style="margin:6px 0 0;color:${COLOR.stone};font-size:13px;">${escapeHtml(serviceName)}</p>

            <div style="margin-top:18px;padding-top:16px;border-top:1px solid #d4ddc5;">
              <p style="margin:0;color:${COLOR.tan700};font-size:10px;letter-spacing:0.18em;text-transform:uppercase;font-weight:600;">Redemption code</p>
              <p style="margin:6px 0 0;font-family:Menlo,Consolas,monospace;font-weight:700;color:${COLOR.charcoal};font-size:22px;letter-spacing:0.04em;">${escapeHtml(code)}</p>
              <p style="margin:4px 0 0;font-size:12px;color:${COLOR.stone};">Value ${formatAud(priceCents)} · Valid until ${formatDatePretty(expiryISO)}</p>
            </div>
          </div>
        </td></tr>

        ${messageBlock}

        <tr><td style="padding:20px 32px 0;">
          <p style="margin:0;color:${COLOR.tan700};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;font-weight:600;">How to use it</p>
          <ol style="margin:8px 0 0 18px;padding:0;color:${COLOR.stone};font-size:14px;line-height:1.6;">
            <li>Book online at <a href="https://www.fwdhealth.com.au" style="color:${COLOR.sage700};">fwdhealth.com.au</a> or call 0420 522 558.</li>
            <li>Tell reception you have a gift card and quote the code above.</li>
            <li>We'll apply it to your appointment — Currimundi or Sandstone Point.</li>
          </ol>
        </td></tr>

        <tr><td style="padding:24px 32px 32px;">
          <p style="margin:0;font-size:12px;color:${COLOR.stone};line-height:1.55;">
            Keep this email safe — the code is the gift card. Terms and conditions at
            <a href="https://www.fwdhealth.com.au/gift-cards/terms" style="color:${COLOR.sage700};">fwdhealth.com.au/gift-cards/terms</a>.
          </p>
          <p style="margin:14px 0 0;font-size:11px;color:#aebb9b;line-height:1.55;">
            Forward Health · 698 Nicklin Way, Currimundi · Shop 3 / 208 Bestmann Rd East, Sandstone Point<br/>
            Issued ${formatDatePretty(issuedISO)} · Valid for 3 years
          </p>
        </td></tr>
      </table>
    </div>
  `;

  const text = [
    toFriend
      ? `Hi ${recipientName}, ${buyerName} has sent you a Forward Health gift card.`
      : `Hi ${buyerName}, here's your Forward Health gift card for ${recipientName}.`,
    ``,
    `Gift: ${serviceShort}`,
    `Details: ${serviceName}`,
    `Value: ${formatAud(priceCents)}`,
    `Redemption code: ${code}`,
    `Valid until: ${formatDatePretty(expiryISO)}`,
    personalMessage && personalMessage.trim() ? `\nFrom ${buyerName}: "${personalMessage.trim()}"` : "",
    ``,
    `How to use it:`,
    `  1. Book online at https://www.fwdhealth.com.au or call 0420 522 558`,
    `  2. Tell reception you have a gift card and quote the code`,
    `  3. We'll apply it to your appointment at Currimundi or Sandstone Point`,
    ``,
    `Terms: https://www.fwdhealth.com.au/gift-cards/terms`,
    `Forward Health · fwdhealth.com.au · 0420 522 558`,
  ]
    .filter((l) => l !== "")
    .join("\n");

  return { subject, html, text };
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY) {
    console.error("Stripe env vars missing for webhook");
    return { statusCode: 500, body: "server not configured" };
  }

  const sig = event.headers["stripe-signature"] || event.headers["Stripe-Signature"];
  if (!sig) return { statusCode: 400, body: "missing signature" };

  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, "base64")
    : Buffer.from(event.body || "", "utf8");

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-10-28.acacia",
  });

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return { statusCode: 400, body: `signature error: ${err.message}` };
  }

  if (stripeEvent.type !== "checkout.session.completed") {
    return { statusCode: 200, body: `ignored event ${stripeEvent.type}` };
  }

  const session = stripeEvent.data.object;
  const meta = session.metadata || {};

  if (meta.kind !== "gift_card_v1") {
    return { statusCode: 200, body: "ignored: not a gift card session" };
  }

  // Validate service still exists in catalogue (defensive — in case we rename ids)
  const service = getServiceById(meta.serviceId);
  if (!service) {
    console.error("Unknown serviceId in webhook metadata:", meta.serviceId);
    return { statusCode: 200, body: "ignored: unknown service" };
  }

  // Idempotency: use the checkout session id as the dedupe key.
  const store = getStore("gift-cards");
  const sessionIdempotencyKey = `processed/${session.id}`;
  const alreadyProcessed = await store.get(sessionIdempotencyKey);
  if (alreadyProcessed) {
    return { statusCode: 200, body: "already processed" };
  }

  // Generate a code, retry a handful of times if collision (very unlikely).
  let code = "";
  for (let i = 0; i < 6; i++) {
    const rb = crypto.randomBytes(16);
    const candidate = generateGiftCardCode(rb);
    const existing = await store.get(`code/${candidate}`);
    if (!existing) {
      code = candidate;
      break;
    }
  }
  if (!code) {
    console.error("Could not generate a unique code after 6 tries");
    return { statusCode: 500, body: "code generation failed" };
  }

  const issuedISO = new Date().toISOString();
  const expiryISO = computeExpiryISO(new Date(issuedISO));
  const priceCents = Number(meta.priceCents) || service.priceCents;

  const record = {
    code,
    status: "active",
    serviceId: service.id,
    serviceName: service.name,
    serviceShort: service.short,
    priceCents,
    buyerName: meta.buyerName || "",
    buyerEmail: meta.buyerEmail || "",
    recipientName: meta.recipientName || "",
    recipientEmail: meta.recipientEmail || "",
    personalMessage: meta.personalMessage || "",
    deliveryMethod: meta.deliveryMethod || "",
    sendOn: meta.sendOn || "",
    stripeSessionId: session.id,
    stripePaymentIntentId: session.payment_intent || "",
    issuedISO,
    expiryISO,
    redeemedISO: null,
    redeemedBy: null,
    redeemedNote: null,
  };

  // Build the PDF.
  let pdfBuffer;
  try {
    pdfBuffer = await buildGiftCardPdf({
      code,
      serviceName: service.name,
      serviceShort: service.short,
      priceCents,
      recipientName: record.recipientName,
      buyerName: record.buyerName,
      personalMessage: record.personalMessage,
      issuedISO,
      expiryISO,
    });
  } catch (err) {
    console.error("PDF generation failed:", err);
    return { statusCode: 500, body: "PDF generation failed" };
  }

  // Compose and send the email.
  const { subject, html, text } = emailSubjectAndBody({
    code,
    deliveryMethod: record.deliveryMethod,
    serviceName: service.name,
    serviceShort: service.short,
    priceCents,
    buyerName: record.buyerName,
    recipientName: record.recipientName,
    personalMessage: record.personalMessage,
    issuedISO,
    expiryISO,
  });

  const toAddress =
    record.deliveryMethod === "email-friend" && record.recipientEmail
      ? record.recipientEmail
      : record.buyerEmail;

  const fromAddress =
    process.env.RESEND_FROM_EMAIL ||
    "Forward Health Gifts <onboarding@resend.dev>";

  const resendResp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [toAddress],
      bcc: ["hello@fwdhealth.com.au"],
      reply_to: "hello@fwdhealth.com.au",
      subject,
      html,
      text,
      attachments: [
        {
          filename: `forward-health-gift-card-${code}.pdf`,
          content: pdfBuffer.toString("base64"),
        },
      ],
    }),
  });

  if (!resendResp.ok) {
    const errBody = await resendResp.text();
    console.error("Resend send failed:", resendResp.status, errBody);
    // Don't 500 to Stripe — if we do it'll retry and we'll re-issue a code.
    // Stash the record anyway so reception can locate the purchase; Stripe
    // dashboard is source of truth for the charge.
    record.emailError = `${resendResp.status}: ${errBody.slice(0, 500)}`;
  }

  // Persist. Two keys so we can lookup either by code or by stripe session.
  await store.setJSON(`code/${code}`, record);
  await store.setJSON(sessionIdempotencyKey, { code, at: issuedISO });

  // Keep a flat list of codes for the admin page (append-only).
  try {
    const indexKey = "index/codes";
    const current = (await store.get(indexKey, { type: "json" })) || [];
    current.push({ code, issuedISO, status: "active" });
    await store.setJSON(indexKey, current);
  } catch (err) {
    console.error("Index update failed (non-fatal):", err);
  }

  return { statusCode: 200, body: `issued ${code}` };
};
