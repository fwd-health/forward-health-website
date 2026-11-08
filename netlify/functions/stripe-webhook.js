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
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getStore } from "./_blobs.js";
import {
  generateGiftCardCode,
  computeExpiryISO,
  formatAud,
  formatDatePretty,
  getServiceById,
} from "../../src/data/gift-cards.js";

// Brand colours (match Tailwind theme in src/styles/global.css)
const COLOR = {
  sage700: "#4a5540",
  tan700: "#7b6540",
  charcoal: "#1a1d1a",
  stone: "#6b6e68",
};

// pdf-lib takes colours as rgb(0..1) tuples.
const hex2rgb = (h) => {
  const n = parseInt(h.replace("#", ""), 16);
  return rgb(((n >> 16) & 0xff) / 255, ((n >> 8) & 0xff) / 255, (n & 0xff) / 255);
};

// Template is bundled next to this function via netlify.toml `included_files`.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PDF_PATH = path.join(__dirname, "assets", "voucher-template.pdf");

const escapeHtml = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

/* ------------------------------------------------------------------ *
 * Gift voucher PDF renderer
 *
 * We take the Forward Health Canva export (netlify/functions/assets/
 * voucher-template.pdf) as the background — logo, "GIFT VOUCHER" headline,
 * labelled sage panels, addresses, contact details — and just overlay the
 * dynamic values at measured coordinates with pdf-lib.
 *
 * Why not render from scratch? Canva owns the layout; Joe can update it,
 * re-export, drop the new PDF in, and this code keeps working as long as
 * the field positions don't change meaningfully.
 *
 * Coordinates below were measured once from the current template with
 * pdfjs-dist (see commit message for the one-liner). If Joe swaps the
 * template and labels move, we re-measure and update the LAYOUT constants.
 * ------------------------------------------------------------------ */

// Measured label baselines in the template's PDF coordinate system
// (origin is bottom-left, units are points, page is 419.25 × 297.75).
const LAYOUT = {
  pageWidth: 419.25,
  pageHeight: 297.75,
  // Values sit inside each sage panel, same x as the label, baseline a fixed
  // offset below the label baseline so it falls into the panel body.
  valueOffsetY: 14,
  issueDateValue: { x: 82, y: 289.8 },  // right of the "Issue date:" label (clear of the colon)
  to:           { x: 47, y: 201.7 },
  from:         { x: 47, y: 172.4 },
  amount:       { x: 47, y: 143.0 },
  validUntil:   { x: 215.9, y: 143.0 },
  service:      { x: 47, y: 113.3 },
  message:      { x: 47, y: 86.7 },
  code:         { x: 47, y: 60.2 },
};

// Trims a value to fit inside a given width at the given font/size, appending
// an ellipsis if needed.
function fitText(str, font, size, maxWidth) {
  if (!str) return "";
  str = String(str);
  if (font.widthOfTextAtSize(str, size) <= maxWidth) return str;
  const ellipsis = "…";
  let lo = 0, hi = str.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    const candidate = str.slice(0, mid).trimEnd() + ellipsis;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) lo = mid;
    else hi = mid - 1;
  }
  return str.slice(0, lo).trimEnd() + ellipsis;
}

// Wraps text to a max width, returning an array of lines (max `maxLines`).
function wrapText(str, font, size, maxWidth, maxLines) {
  if (!str) return [];
  const words = String(str).split(/\s+/);
  const lines = [];
  let cur = "";
  for (const word of words) {
    const trial = cur ? `${cur} ${word}` : word;
    if (font.widthOfTextAtSize(trial, size) <= maxWidth) {
      cur = trial;
    } else {
      if (cur) lines.push(cur);
      cur = word;
      if (lines.length >= maxLines) break;
    }
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  // If last line still overflows (single very long word), ellipsis it.
  if (lines.length === maxLines && lines[lines.length - 1]) {
    lines[lines.length - 1] = fitText(lines[lines.length - 1], font, size, maxWidth);
  }
  return lines;
}

async function buildGiftCardPdf({
  code,
  serviceShort,
  priceCents,
  recipientName,
  buyerName,
  personalMessage,
  issuedISO,
  expiryISO,
}) {
  // Load the Canva template and work on top of it.
  const templateBytes = fs.readFileSync(TEMPLATE_PDF_PATH);
  const pdf = await PDFDocument.load(templateBytes);
  pdf.setTitle(`Forward Health Gift Voucher ${code}`);
  pdf.setAuthor("Forward Health");
  pdf.setSubject(`Gift voucher for ${recipientName}`);

  const page = pdf.getPage(0);
  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const helvBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const helvOblique = await pdf.embedFont(StandardFonts.HelveticaOblique);
  const courier = await pdf.embedFont(StandardFonts.CourierBold);

  const ink = hex2rgb(COLOR.charcoal);

  // ----- Issue date (right of the "Issue date:" label at top-left) -----
  page.drawText(formatDatePretty(issuedISO), {
    x: LAYOUT.issueDateValue.x,
    y: LAYOUT.issueDateValue.y,
    font: helv,
    size: 8,
    color: ink,
  });

  // Value font/size for panel body text.
  const valueSize = 12;
  const valueFont = helv;

  // Each panel's value slot: just below the label at the same x.
  const drawPanelValue = (label, text, opts = {}) => {
    const anchor = LAYOUT[label];
    const font = opts.font || valueFont;
    const size = opts.size || valueSize;
    const maxWidth = opts.maxWidth ?? (LAYOUT.pageWidth - anchor.x - 24);
    const line = fitText(text, font, size, maxWidth);
    page.drawText(line, {
      x: anchor.x,
      y: anchor.y - LAYOUT.valueOffsetY,
      font,
      size,
      color: opts.color || ink,
    });
  };

  // Full-width panels (TO, FROM, SERVICE)
  drawPanelValue("to", recipientName);
  drawPanelValue("from", buyerName);
  drawPanelValue("service", serviceShort);

  // AMOUNT (half width — ends before VALID UNTIL)
  drawPanelValue("amount", formatAud(priceCents), {
    font: helvBold,
    size: 13,
    maxWidth: LAYOUT.validUntil.x - LAYOUT.amount.x - 12,
  });

  // VALID UNTIL (half width — ends before right page edge)
  drawPanelValue("validUntil", formatDatePretty(expiryISO), {
    maxWidth: LAYOUT.pageWidth - LAYOUT.validUntil.x - 24,
  });

  // REDEMPTION CODE — monospace, visually weighty but kept at 12pt so it
  // stays inside the sage panel at the bottom of the template.
  drawPanelValue("code", code, {
    font: courier,
    size: 12,
  });

  // MESSAGE — wraps to 2 lines if needed, italic. Panel is single-line tall
  // on the current template so we cap to 1 line and ellipsis anything longer.
  // (If Joe makes the MESSAGE panel taller later, bump maxLines.)
  const messageText = (personalMessage || "").trim();
  if (messageText) {
    const msgLines = wrapText(
      `"${messageText}"`,
      helvOblique,
      11,
      LAYOUT.pageWidth - LAYOUT.message.x - 24,
      1,
    );
    msgLines.forEach((line, i) => {
      page.drawText(line, {
        x: LAYOUT.message.x,
        y: LAYOUT.message.y - LAYOUT.valueOffsetY - i * 13,
        font: helvOblique,
        size: 11,
        color: ink,
      });
    });
  }

  const outBytes = await pdf.save();
  return Buffer.from(outBytes);
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

  // Strip trailing asterisks (used on the picker UI to flag the no-pre-screen
  // packs) before we render to PDF or email — the recipient has no context
  // for a floating asterisk on their card.
  const serviceShortClean = service.short.replace(/\*+$/, "").trim();
  const serviceNameClean = service.name.replace(/\*+$/, "").trim();

  // Try to use Netlify Blobs for idempotency + storage. If it isn't available
  // (e.g. NETLIFY_AUTH_TOKEN not set yet), fall through and skip persistence —
  // we still send the email so the customer isn't left hanging. The BCC to
  // hello@fwdhealth.com.au is the backstop record in that case.
  let store = null;
  try {
    store = getStore("gift-cards");
    const sessionIdempotencyKey = `processed/${session.id}`;
    const alreadyProcessed = await store.get(sessionIdempotencyKey);
    if (alreadyProcessed) {
      return { statusCode: 200, body: "already processed" };
    }
  } catch (err) {
    console.error("Netlify Blobs unavailable, continuing without persistence:", err.message);
    store = null;
  }

  // Derive the code DETERMINISTICALLY from session.id. This is critical:
  // if the function runs more than once for the same Stripe session (webhook
  // retries, manual resend, concurrent invocations) we must produce the same
  // code every time — otherwise the recipient sees two or more different
  // codes and we lose track of which one is "real". HMAC with the webhook
  // secret keeps the code unguessable from a leaked session id.
  const codeSeed = crypto
    .createHmac("sha256", process.env.STRIPE_WEBHOOK_SECRET)
    .update(session.id)
    .digest();
  const code = generateGiftCardCode(codeSeed);

  // Issue time is also derived from the Stripe session, so the expiry date on
  // the PDF is stable across retries. session.created is a Unix timestamp
  // (seconds); fall back to now if somehow absent.
  const issuedISO = new Date((session.created || Date.now() / 1000) * 1000).toISOString();
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
      serviceName: serviceNameClean,
      serviceShort: serviceShortClean,
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
    serviceName: serviceNameClean,
    serviceShort: serviceShortClean,
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

  // Resend dedupes requests that share an Idempotency-Key within 24h. Keying
  // on the Stripe session id means any retried / resent webhook for the same
  // checkout results in ONE email, not N.
  // https://resend.com/docs/api-reference/idempotency-keys
  const resendResp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `gift-card-${session.id}`,
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

  // Persist to Blobs if it's available. All failures here are non-fatal — the
  // email has already been sent and the BCC to hello@fwdhealth.com.au is the
  // backstop audit record.
  if (store) {
    try {
      await store.setJSON(`code/${code}`, record);
      await store.setJSON(`processed/${session.id}`, { code, at: issuedISO });
      const indexKey = "index/codes";
      const current = (await store.get(indexKey, { type: "json" })) || [];
      current.push({ code, issuedISO, status: "active" });
      await store.setJSON(indexKey, current);
    } catch (err) {
      console.error("Blobs persistence failed (non-fatal):", err);
    }
  }

  return { statusCode: 200, body: `issued ${code}` };
};
