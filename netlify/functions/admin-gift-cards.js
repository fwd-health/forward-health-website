// Admin dashboard for Forward Health gift cards.
//
// Accessed via the redirect:
//   /admin/gift-cards  →  /.netlify/functions/admin-gift-cards
//
// Protected by HTTP Basic Auth. One password across all reception staff is
// fine for a tool at this scale — rotate via Netlify env vars if needed.
//
// Env vars required:
//   ADMIN_PASSWORD   — any string; used as the Basic Auth password
//                       Username is always "admin".
//
// Actions:
//   GET  (no query)              → list all codes (newest first)
//   GET  ?code=XXX                → view a single card
//   POST { code, action: redeem, redeemedBy, note }   → mark redeemed
//   POST { code, action: unredeem }                    → undo redemption
//   POST { code, action: void }                        → cancel/void a card

import { getStore } from "@netlify/blobs";
import { formatAud, formatDatePretty } from "../../src/data/gift-cards.js";

const COLOR = {
  sage600: "#5e6b4d",
  sage700: "#4a5540",
  sage50: "#f3f5ef",
  tan600: "#9b8155",
  tan700: "#7b6540",
  tan50: "#faf5e9",
  cream50: "#faf7ef",
  charcoal: "#1a1d1a",
  stone: "#6b6e68",
  red: "#9b3b3b",
  redBg: "#faf0f0",
};

const escapeHtml = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const unauthorized = () => ({
  statusCode: 401,
  headers: {
    "WWW-Authenticate": 'Basic realm="Forward Health admin"',
    "Content-Type": "text/plain",
  },
  body: "Authentication required.",
});

function checkAuth(event) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const header = event.headers.authorization || event.headers.Authorization || "";
  if (!header.startsWith("Basic ")) return false;
  const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  const idx = decoded.indexOf(":");
  if (idx < 0) return false;
  const pwd = decoded.slice(idx + 1);
  // Constant-time compare
  const a = Buffer.from(pwd, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  try {
    const crypto = require("node:crypto");
    return crypto.timingSafeEqual(a, b);
  } catch {
    return a.equals(b);
  }
}

async function loadAllCards(store) {
  const index = (await store.get("index/codes", { type: "json" })) || [];
  // Sort newest first
  index.sort((a, b) => (b.issuedISO || "").localeCompare(a.issuedISO || ""));
  const records = [];
  for (const row of index) {
    const r = await store.get(`code/${row.code}`, { type: "json" });
    if (r) records.push(r);
  }
  return records;
}

const page = (bodyHtml, { flash, filter } = {}) => `<!doctype html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Gift cards · Forward Health admin</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body { margin:0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background:${COLOR.cream50}; color:${COLOR.charcoal}; }
    .wrap { max-width: 1120px; margin: 0 auto; padding: 24px 20px 60px; }
    header { display:flex; align-items:baseline; justify-content:space-between; gap: 20px; margin-bottom: 20px; flex-wrap: wrap; }
    h1 { font-family: Georgia, "Times New Roman", serif; font-weight: 700; margin: 0; font-size: 28px; }
    .eyebrow { color:${COLOR.tan700}; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; margin-bottom: 4px; }
    .flash { background:${COLOR.sage50}; border:1px solid #d4ddc5; color:${COLOR.sage700}; padding: 10px 14px; border-radius: 10px; margin-bottom: 16px; }
    .toolbar { display:flex; gap:10px; margin-bottom: 14px; flex-wrap:wrap; }
    .toolbar input { padding: 8px 12px; border:1px solid #d9ddd2; border-radius: 10px; min-width: 240px; font-size: 14px; }
    .toolbar select { padding: 8px 12px; border:1px solid #d9ddd2; border-radius: 10px; font-size: 14px; background: white; }
    table { width:100%; border-collapse: collapse; background:white; border:1px solid #e4e8dc; border-radius: 14px; overflow:hidden; }
    th { text-align:left; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: ${COLOR.stone}; font-weight: 600; padding: 12px 14px; background: ${COLOR.sage50}; border-bottom: 1px solid #e4e8dc; }
    td { padding: 12px 14px; border-top: 1px solid #f0f2ea; vertical-align: top; font-size: 14px; }
    tr:first-child td { border-top: none; }
    .code { font-family: Menlo, Consolas, monospace; font-weight: 700; font-size: 13px; letter-spacing: 0.02em; }
    .status { display:inline-block; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 3px 8px; border-radius: 999px; }
    .status-active { background:${COLOR.sage50}; color:${COLOR.sage700}; border: 1px solid #d4ddc5; }
    .status-redeemed { background:${COLOR.tan50}; color:${COLOR.tan700}; border: 1px solid #ead9b3; }
    .status-void { background:${COLOR.redBg}; color:${COLOR.red}; border: 1px solid #e9c4c4; }
    a.btn, button.btn { display:inline-block; padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; text-decoration: none; border: 1px solid #d9ddd2; background: white; color: ${COLOR.charcoal}; cursor: pointer; }
    a.btn:hover, button.btn:hover { border-color: ${COLOR.sage600}; }
    .btn-primary { background: ${COLOR.sage600}; color: white; border-color: ${COLOR.sage600}; }
    .btn-primary:hover { background: ${COLOR.sage700}; }
    .btn-danger { color: ${COLOR.red}; border-color: #e9c4c4; }
    .muted { color: ${COLOR.stone}; font-size: 12px; }
    .empty { text-align: center; padding: 60px 20px; color: ${COLOR.stone}; background: white; border: 1px solid #e4e8dc; border-radius: 14px; }
    .card { background: white; border: 1px solid #e4e8dc; border-radius: 14px; padding: 24px; margin-bottom: 20px; }
    .grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .label { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: ${COLOR.tan700}; font-weight: 600; margin-bottom: 4px; }
    .value { font-size: 15px; color: ${COLOR.charcoal}; }
    form.inline { display:inline; }
    form.block { margin-top: 16px; }
    form.block label { display: block; font-size: 12px; color: ${COLOR.stone}; margin-top: 10px; margin-bottom: 4px; }
    form.block input[type=text] { width:100%; padding: 8px 12px; border:1px solid #d9ddd2; border-radius: 10px; font-size: 14px; }
    @media (max-width: 720px) {
      th.hide-mobile, td.hide-mobile { display: none; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <div>
        <p class="eyebrow">Forward Health · Admin</p>
        <h1>Gift cards</h1>
      </div>
      <div>
        <a class="btn" href="/admin/gift-cards">All cards</a>
      </div>
    </header>
    ${flash ? `<div class="flash">${escapeHtml(flash)}</div>` : ""}
    ${bodyHtml}
  </div>
</body>
</html>`;

function listView(records, filter = "") {
  const q = (filter || "").toLowerCase().trim();
  const filtered = q
    ? records.filter(
        (r) =>
          r.code.toLowerCase().includes(q) ||
          (r.recipientName || "").toLowerCase().includes(q) ||
          (r.buyerName || "").toLowerCase().includes(q) ||
          (r.recipientEmail || "").toLowerCase().includes(q) ||
          (r.buyerEmail || "").toLowerCase().includes(q),
      )
    : records;

  const totals = {
    active: records.filter((r) => r.status === "active").length,
    redeemed: records.filter((r) => r.status === "redeemed").length,
    void: records.filter((r) => r.status === "void").length,
  };

  const rows = filtered
    .map((r) => {
      const statusClass =
        r.status === "redeemed" ? "status-redeemed" : r.status === "void" ? "status-void" : "status-active";
      return `
        <tr>
          <td><span class="code">${escapeHtml(r.code)}</span></td>
          <td>${escapeHtml(r.serviceShort)}<br/><span class="muted">${formatAud(r.priceCents)}</span></td>
          <td>${escapeHtml(r.recipientName)}<br/><span class="muted">${escapeHtml(r.recipientEmail || "no email")}</span></td>
          <td class="hide-mobile">${escapeHtml(r.buyerName)}<br/><span class="muted">${escapeHtml(r.buyerEmail || "")}</span></td>
          <td class="hide-mobile">${formatDatePretty(r.issuedISO)}<br/><span class="muted">exp ${formatDatePretty(r.expiryISO)}</span></td>
          <td><span class="status ${statusClass}">${r.status}</span></td>
          <td><a class="btn" href="/admin/gift-cards?code=${encodeURIComponent(r.code)}">Open</a></td>
        </tr>
      `;
    })
    .join("");

  return `
    <form class="toolbar" method="get" action="/admin/gift-cards">
      <input type="search" name="q" placeholder="Search code, recipient, buyer…" value="${escapeHtml(filter || "")}" />
      <button class="btn btn-primary" type="submit">Search</button>
      <span style="flex:1"></span>
      <span class="status status-active">${totals.active} active</span>
      <span class="status status-redeemed">${totals.redeemed} redeemed</span>
      <span class="status status-void">${totals.void} void</span>
    </form>
    ${
      filtered.length === 0
        ? `<div class="empty">${q ? "No cards matched that search." : "No gift cards issued yet."}</div>`
        : `<table>
            <thead><tr>
              <th>Code</th><th>Service</th><th>Recipient</th><th class="hide-mobile">Buyer</th><th class="hide-mobile">Issued / expires</th><th>Status</th><th></th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>`
    }
  `;
}

function detailView(r) {
  const statusClass =
    r.status === "redeemed" ? "status-redeemed" : r.status === "void" ? "status-void" : "status-active";

  const redeemForm =
    r.status === "active"
      ? `
      <form class="block" method="post" action="/admin/gift-cards">
        <input type="hidden" name="code" value="${escapeHtml(r.code)}" />
        <input type="hidden" name="action" value="redeem" />
        <label for="redeemedBy">Redeemed by (patient name)</label>
        <input id="redeemedBy" type="text" name="redeemedBy" required placeholder="e.g. Sarah Thompson" />
        <label for="redeemedNote">Note (optional — e.g. appointment date)</label>
        <input id="redeemedNote" type="text" name="redeemedNote" placeholder="e.g. applied to appt 12 Dec 2026" />
        <div style="margin-top:14px;display:flex;gap:10px;">
          <button class="btn btn-primary" type="submit">Mark redeemed</button>
        </div>
      </form>
      <form class="block" method="post" action="/admin/gift-cards" onsubmit="return confirm('Void this gift card? The code will no longer be redeemable.');">
        <input type="hidden" name="code" value="${escapeHtml(r.code)}" />
        <input type="hidden" name="action" value="void" />
        <button class="btn btn-danger" type="submit">Void gift card</button>
      </form>
    `
      : r.status === "redeemed"
        ? `
      <form class="block" method="post" action="/admin/gift-cards" onsubmit="return confirm('Undo redemption — reinstate as active?');">
        <input type="hidden" name="code" value="${escapeHtml(r.code)}" />
        <input type="hidden" name="action" value="unredeem" />
        <button class="btn" type="submit">Undo redemption</button>
      </form>`
        : "";

  return `
    <div class="card">
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap;">
        <div>
          <p class="label">Code</p>
          <p class="code" style="font-size:20px;">${escapeHtml(r.code)}</p>
        </div>
        <span class="status ${statusClass}">${r.status}</span>
      </div>
    </div>
    <div class="card">
      <div class="grid">
        <div><p class="label">Service</p><p class="value">${escapeHtml(r.serviceShort)}</p><p class="muted">${escapeHtml(r.serviceName)}</p></div>
        <div><p class="label">Value</p><p class="value">${formatAud(r.priceCents)}</p></div>
        <div><p class="label">Issued</p><p class="value">${formatDatePretty(r.issuedISO)}</p></div>
        <div><p class="label">Expires</p><p class="value">${formatDatePretty(r.expiryISO)}</p></div>
      </div>
    </div>
    <div class="card">
      <div class="grid">
        <div><p class="label">Recipient</p><p class="value">${escapeHtml(r.recipientName)}</p><p class="muted">${escapeHtml(r.recipientEmail || "no email")}</p></div>
        <div><p class="label">Buyer</p><p class="value">${escapeHtml(r.buyerName)}</p><p class="muted">${escapeHtml(r.buyerEmail || "")}</p></div>
        <div><p class="label">Delivery</p><p class="value">${r.deliveryMethod === "email-friend" ? "Emailed to friend" : "Emailed to buyer to print"}</p>${r.sendOn ? `<p class="muted">Scheduled: ${escapeHtml(r.sendOn)}</p>` : ""}</div>
        <div><p class="label">Stripe session</p><p class="value" style="font-size:12px;font-family:Menlo,Consolas,monospace;">${escapeHtml(r.stripeSessionId)}</p></div>
      </div>
      ${r.personalMessage ? `<div style="margin-top:16px;padding-top:16px;border-top:1px solid #f0f2ea;"><p class="label">Personal message</p><p class="value" style="font-style:italic;">"${escapeHtml(r.personalMessage)}"</p></div>` : ""}
      ${r.emailError ? `<div style="margin-top:16px;padding:10px 14px;background:${COLOR.redBg};color:${COLOR.red};border-radius:10px;font-size:13px;"><strong>Email delivery failed:</strong> ${escapeHtml(r.emailError)}</div>` : ""}
    </div>
    ${
      r.redeemedISO
        ? `<div class="card"><p class="label">Redeemed</p><p class="value">${formatDatePretty(r.redeemedISO)} — by ${escapeHtml(r.redeemedBy || "(unknown)")}</p>${r.redeemedNote ? `<p class="muted" style="margin-top:4px;">${escapeHtml(r.redeemedNote)}</p>` : ""}</div>`
        : ""
    }
    ${redeemForm}
  `;
}

export const handler = async (event) => {
  if (!process.env.ADMIN_PASSWORD) {
    return { statusCode: 500, body: "Admin password not configured." };
  }
  if (!checkAuth(event)) return unauthorized();

  const store = getStore("gift-cards");

  // Handle POST actions (redeem, unredeem, void).
  if (event.httpMethod === "POST") {
    let params = new URLSearchParams(event.body || "");
    // Support JSON too, in case we add an API later.
    const ct = (event.headers["content-type"] || event.headers["Content-Type"] || "").toLowerCase();
    if (ct.includes("application/json")) {
      try {
        const o = JSON.parse(event.body || "{}");
        params = new URLSearchParams(o);
      } catch {}
    }
    const code = (params.get("code") || "").trim();
    const action = (params.get("action") || "").trim();
    const r = await store.get(`code/${code}`, { type: "json" });
    if (!r) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" },
        body: page(`<div class="empty">Code not found.</div>`),
      };
    }

    let flash = "";
    if (action === "redeem" && r.status === "active") {
      r.status = "redeemed";
      r.redeemedISO = new Date().toISOString();
      r.redeemedBy = (params.get("redeemedBy") || "").trim() || null;
      r.redeemedNote = (params.get("redeemedNote") || "").trim() || null;
      flash = `${r.code} marked redeemed.`;
    } else if (action === "unredeem" && r.status === "redeemed") {
      r.status = "active";
      r.redeemedISO = null;
      r.redeemedBy = null;
      r.redeemedNote = null;
      flash = `${r.code} reinstated to active.`;
    } else if (action === "void" && r.status === "active") {
      r.status = "void";
      flash = `${r.code} voided.`;
    } else {
      flash = `No change (card status was ${r.status}, action was ${action}).`;
    }
    await store.setJSON(`code/${code}`, r);

    return {
      statusCode: 303,
      headers: {
        Location: `/admin/gift-cards?code=${encodeURIComponent(code)}&flash=${encodeURIComponent(flash)}`,
      },
      body: "",
    };
  }

  // GET: either list or detail.
  const qs = new URLSearchParams(event.rawQuery || "");
  const codeParam = (qs.get("code") || "").trim();
  const flash = qs.get("flash") || "";
  const filter = qs.get("q") || "";

  if (codeParam) {
    const r = await store.get(`code/${codeParam}`, { type: "json" });
    if (!r) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" },
        body: page(`<div class="empty">Code <strong>${escapeHtml(codeParam)}</strong> not found.</div>`, { flash }),
      };
    }
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: page(detailView(r), { flash }),
    };
  }

  const records = await loadAllCards(store);
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
    body: page(listView(records, filter), { flash }),
  };
};
