// Shared gift card catalogue.
// Imported by:
//   - src/pages/gift-cards/*.astro  (landing page, UI copy)
//   - netlify/functions/create-checkout-session.js  (price lookup, validation)
//   - netlify/functions/stripe-webhook.js  (service name in emails/PDF)
//
// Prices are in AUD cents (Stripe convention) and mirror what we charge in
// clinic, as per the pricing page:
//   - Pilates pre-screen $147 + 3-class pack $122 = $269 (starter, new clients)
//   - Pilates pre-screen $147 + 6-class pack $230 = $377 (starter, new clients)
//   - 3-class pack alone $122, 6-class pack alone $230 (top-ups / existing clients)
//   - 30/45/60 min remedial massage: $87 / $102 / $137

export const GIFT_CARD_EXPIRY_YEARS = 3;

export const GIFT_CARD_SERVICES = [
  {
    id: "pilates-3",
    name: "Clinical Pilates starter — pre-screen + 3-class pack",
    short: "Pilates starter — 3 classes",
    description:
      "60-minute 1-on-1 pre-screen with a physio, plus three group reformer classes. Ideal for a recipient new to our Pilates.",
    priceAud: 269,
    priceCents: 26900,
    includes: [
      "60-minute 1-on-1 Pilates pre-screen",
      "3 × reformer group class credits",
      "Currimundi or Sandstone Point",
    ],
  },
  {
    id: "pilates-6",
    name: "Clinical Pilates starter — pre-screen + 6-class pack",
    short: "Pilates starter — 6 classes",
    description:
      "60-minute 1-on-1 pre-screen with a physio, plus six group reformer classes. Ideal for a recipient new to our Pilates.",
    priceAud: 377,
    priceCents: 37700,
    includes: [
      "60-minute 1-on-1 Pilates pre-screen",
      "6 × reformer group class credits",
      "Currimundi or Sandstone Point",
    ],
  },
  {
    id: "pilates-3-only",
    name: "Clinical Pilates — 3-class pack",
    short: "3-class Pilates pack*",
    description:
      "Three group reformer classes. For recipients already cleared by our physios.*",
    priceAud: 122,
    priceCents: 12200,
    includes: [
      "3 × reformer group class credits",
      "Currimundi or Sandstone Point",
      "*New clients must pre-screen first — see note below",
    ],
  },
  {
    id: "pilates-6-only",
    name: "Clinical Pilates — 6-class pack",
    short: "6-class Pilates pack*",
    description:
      "Six group reformer classes. For recipients already cleared by our physios.*",
    priceAud: 230,
    priceCents: 23000,
    includes: [
      "6 × reformer group class credits",
      "Currimundi or Sandstone Point",
      "*New clients must pre-screen first — see note below",
    ],
  },
  {
    id: "massage-60",
    name: "60-minute remedial massage",
    short: "60-min remedial massage",
    description:
      "A full-hour, hands-on remedial massage with one of our qualified RMTs.",
    priceAud: 137,
    priceCents: 13700,
    includes: [
      "60 minutes, treatment-room appointment",
      "Deep tissue, sports, or pregnancy massage",
      "Currimundi or Sandstone Point",
    ],
  },
  {
    id: "massage-45",
    name: "45-minute remedial massage",
    short: "45-min remedial massage",
    description:
      "A longer targeted remedial massage session with one of our qualified RMTs.",
    priceAud: 102,
    priceCents: 10200,
    includes: [
      "45 minutes, treatment-room appointment",
      "Focused on one or two problem areas",
      "Currimundi or Sandstone Point",
    ],
  },
  {
    id: "massage-30",
    name: "30-minute remedial massage",
    short: "30-min remedial massage",
    description:
      "A focused 30-minute remedial massage — perfect for a quick reset.",
    priceAud: 87,
    priceCents: 8700,
    includes: [
      "30 minutes, treatment-room appointment",
      "Targeted single-area work",
      "Currimundi or Sandstone Point",
    ],
  },
];

export const getServiceById = (id) =>
  GIFT_CARD_SERVICES.find((s) => s.id === id) || null;

// Confusable-safe alphabet: no 0/O, 1/I/L
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

// Generates a human-readable code like FH-GIFT-K8M3-QR2P
export function generateGiftCardCode(randomBytes) {
  const pick = (n) => {
    let out = "";
    for (let i = 0; i < n; i++) {
      out += CODE_ALPHABET[randomBytes[i] % CODE_ALPHABET.length];
    }
    return out;
  };
  return `FH-GIFT-${pick(4)}-${pick(4).split("").reverse().join("")}`;
}

// 3 years from issue
export function computeExpiryISO(fromDate = new Date()) {
  const d = new Date(fromDate);
  d.setFullYear(d.getFullYear() + GIFT_CARD_EXPIRY_YEARS);
  return d.toISOString();
}

export function formatAud(cents) {
  const dollars = cents / 100;
  return `$${dollars.toFixed(0)}`;
}

export function formatDatePretty(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
