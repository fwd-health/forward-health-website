// Creates a Stripe Checkout session for a Forward Health gift card purchase.
//
// Env vars required (set in Netlify → Project configuration → Environment vars):
//   STRIPE_SECRET_KEY      — Stripe secret key (live or test, both work)
//   SITE_URL               — Public site URL, e.g. https://www.fwdhealth.com.au
//                            (falls back to the request origin if unset)
//
// Reads from shared data: ../../src/data/gift-cards.js

import Stripe from "stripe";
import { getServiceById } from "../../src/data/gift-cards.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bad = (statusCode, error) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ error }),
});

const ok = (data) => ({
  statusCode: 200,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

const truncate = (s, max) => (typeof s === "string" ? s.slice(0, max) : "");

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return bad(405, "Method not allowed");
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY env var not set");
    return bad(500, "Payment is temporarily unavailable. Please try again shortly.");
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return bad(400, "Invalid request body");
  }

  const {
    serviceId,
    deliveryMethod,
    buyerName,
    buyerEmail,
    recipientName,
    recipientEmail,
    personalMessage,
    sendOn,
  } = payload || {};

  const service = getServiceById(serviceId);
  if (!service) return bad(400, "Please choose a gift card option.");

  if (!["email-friend", "email-me-to-print"].includes(deliveryMethod)) {
    return bad(400, "Please choose a delivery method.");
  }

  if (!buyerName || buyerName.length < 2) return bad(400, "Please tell us your name.");
  if (!EMAIL_RE.test(buyerEmail || "")) return bad(400, "Please check your email address.");
  if (!recipientName || recipientName.length < 2)
    return bad(400, "Please tell us who the gift card is for.");

  if (deliveryMethod === "email-friend" && !EMAIL_RE.test(recipientEmail || "")) {
    return bad(400, "Please add your recipient's email so we can deliver it to them.");
  }

  // Optional sendOn must be a valid date in the near future and not before today.
  let sendOnClean = "";
  if (sendOn) {
    const d = new Date(sendOn);
    if (Number.isNaN(d.getTime())) return bad(400, "That send-on date doesn't look right.");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (d < today) return bad(400, "Send-on date must be today or later.");
    // Cap at 1 year out — avoids someone scheduling 2030.
    const maxOut = new Date();
    maxOut.setFullYear(maxOut.getFullYear() + 1);
    if (d > maxOut) return bad(400, "Send-on date must be within the next year.");
    sendOnClean = d.toISOString().slice(0, 10); // YYYY-MM-DD
  }

  const siteUrl =
    process.env.SITE_URL ||
    (event.headers && (event.headers.origin || event.headers.Origin)) ||
    "https://www.fwdhealth.com.au";

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-10-28.acacia",
  });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: buyerEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "aud",
            unit_amount: service.priceCents,
            product_data: {
              name: `Forward Health gift card — ${service.name}`,
              description: `Digital gift card, redeemable at Forward Health Currimundi or Sandstone Point.`,
            },
          },
        },
      ],
      // All metadata values must be strings and <= 500 chars each.
      metadata: {
        kind: "gift_card_v1",
        serviceId: service.id,
        serviceName: truncate(service.name, 240),
        serviceShort: truncate(service.short, 120),
        priceCents: String(service.priceCents),
        deliveryMethod,
        buyerName: truncate(buyerName, 120),
        buyerEmail: truncate(buyerEmail, 240),
        recipientName: truncate(recipientName, 120),
        recipientEmail: truncate(recipientEmail || "", 240),
        personalMessage: truncate(personalMessage || "", 400),
        sendOn: sendOnClean,
      },
      success_url: `${siteUrl}/gift-cards/success`,
      cancel_url: `${siteUrl}/gift-cards/cancel`,
      // Stripe will fail if the email the buyer enters at Checkout differs
      // from customer_email, since we pre-fill. Allowing promotion codes is
      // off by default; keep off.
    });

    return ok({ url: session.url, id: session.id });
  } catch (err) {
    console.error("Stripe checkout create failed:", err);
    return bad(502, "Couldn't start checkout. Please try again, or call us on 0420 522 558.");
  }
};
