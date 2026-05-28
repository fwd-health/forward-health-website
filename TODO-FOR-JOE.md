# Forward Health — what's still on the list

Live state, what's done, and what's still to do.

> **As of 2026-05-25:** Site is live at **https://fwdhealth.com.au** (Netlify + Let's Encrypt + GoDaddy DNS pointing at Netlify, Google Workspace MX records untouched). 28 pages built clean from Astro. Referral form pipeline working end-to-end via Netlify Function + Resend → `hello@fwdhealth.com.au`. Google Search Console verified, sitemaps submitted, 6 priority URLs queued for indexing.

---

## 🟢 Quick wins (5–15 min each, do whenever)

### 1. Finish the indexing-request batch
In Google Search Console → top URL inspection bar → paste each, press Enter, click **Request Indexing**:

```
https://fwdhealth.com.au/paediatric-physio
https://fwdhealth.com.au/mums-and-bubs
https://fwdhealth.com.au/locations/currimundi
https://fwdhealth.com.au/locations/sandstone-point
https://fwdhealth.com.au/contact
```

### 2. Google Business Profile refresh (BIGGEST local-SEO lever)
Both clinics. Roughly 15 min:
- Upload current clinic photos (interior, reception, treatment rooms, pilates studio)
- Confirm services list is complete (each service as its own entry: Physiotherapy, Pelvic floor physio, Clinical pilates, etc.)
- Hours per day
- Add the **Sandstone Point clarifier** to that GBP's description: *"Two shops in The Village Sandstone Point: main clinic next to Sandstone Point Bakery for new patients + regular physio, Pilates Studio next to the dentist for classes."*
- Post a quick update: *"Currimundi Pilates classes are back! Mon 10am, Tue 2pm, Wed 8am, Fri 8am."*

### 3. Reviews kick-off
- Grab your GBP review shortlink for each clinic (Google Business → Customers → Reviews → Get more reviews)
- I'll draft a patient-email template you can copy-paste — just send me both shortlinks

### 4. Confirm social handles for the footer
The Instagram + Facebook icons currently link to `instagram.com/forwardhealth.com.au/` and `facebook.com/forwardhealth.com.au` (my best guess). Confirm the real handles and I'll swap them.

### 5. Partner backlink asks
Quick friendly DMs/emails to your co-located partners asking them to link to fwdhealth.com.au from their "partners" / "trusted clinics" sections. Mutual local links carry serious SEO weight.
- Currimundi Family Doctors
- Andrew Khoury Podiatry
- Sports & Orthopaedic Acupuncture Queensland (SOAQ)
- Just See Bee Kinesiology

---

## 📋 Content I need from you

- **Opening hours per clinic per day** — both Currimundi and Sandstone Point. I'll wire them into `/contact` and `/policies` (currently placeholder text on `/contact`).
- **Confirm Instagram and Facebook handles** (see Quick win #4)
- **Read the two newer pages and tell me what to tighten:**
  - `/strength-and-balance` — verify class times, copy, claims
  - `/hydrotherapy` — verify pool location (Bribie Island Aquatic Centre), billing wording, anything else specific to how the class actually runs

---

## 📸 Photos still wanted

| What | Status | Where it lands |
|---|---|---|
| **Currimundi clinic** — exterior + interior + reception + pilates corner | Single Google scrape in use. Properly-lit shots needed to match Sandstone Point's photo strip. | `/locations/currimundi` + `/locations` |
| **Mums & Bubs homepage teaser** | Reuses the pregnancy-physio shot. Want a real mum-with-bub shot. | M&B callout on `/` |
| **Tara Donnolley** — new pro headshot | Current shot is OK. You flagged wanting a refresh. | `/team`, `/remedial-massage`, `/locations/currimundi` |
| **Suzie Irwin** — refreshed pro headshot | Current pro shot is in. You flagged wanting another. | `/team`, `/remedial-massage`, `/locations/currimundi` |
| **Lightbox lifestyle photos for Tara, Erin, Maddie** | Other practitioners have 3 personal photos each in their lightbox. These three don't yet. Drop into `src/assets/team/personal/<firstname>/`. | Lightbox modals on `/team` |
| **Run Club action shot** *(nice to have)* | Currently uses corgi-mascot poster + "All For Run" art. A real candid run shot would round it out. | `/run-club` |
| **Careers team photo** *(nice to have)* | Currently the pottery class shot. Want a fresher full-team photo whenever there's one. | `/careers` hero |

When you have any of these, drop them in `/Users/joe/Downloads/` and tell me the filenames — I'll convert (HEIC → JPEG), rotate if needed, crop sensibly, and wire them in.

---

## 🎯 Medium-term SEO content work

Based on the rank check we ran — strong on hyperlocal Currimundi/SSP/Bribie terms, weak on broader "Sunshine Coast" queries. Where to invest content time:

- **Build location landing pages** for the queries we're losing:
  - `/running-assessments-sunshine-coast` — Joe's credentials, Run Club connection, treadmill setup
  - `/paediatric-physio-sunshine-coast` — Steph + Bri credentials, M&B cross-link
- **Add local-flavour to existing service pages** — each service page should mention 3–5 suburb names in body text. Google reads geo signals from body content. *("Serving Caloundra to Pelican Waters", "patients from Bribie to Banksia Beach", etc.)*
- **Refresh `/physiotherapy-bribie-island`** with more local content — drive times, parking, what's special about your Bribie/Sandstone offer

I can draft any/all of these when you have an hour to react.

---

## 📌 Bigger / future-round items

- [ ] **Colour scheme refresh** — open to brighter/more vibrant palette than the sage + cream + tan. Worth a dedicated design pass.
- [ ] **Homepage hero refresh** — current wundachair shot is good, open to swapping when a stronger candidate emerges.
- [ ] **Register `mumsandbubsphysio.com.au` defensively** (~$15/year) so no one else grabs it. Park it or 301 it to `/mums-and-bubs`. ~2 min at any registrar.
- [ ] **Sanity Studio init** (optional, no rush) — scaffold is in `sanity-studio/`. Run `npx sanity init` from inside that folder if you ever want a non-dev CMS for editing practitioner bios / service copy. Not needed for launch.

---

## ✅ Done since launch

- Site live at fwdhealth.com.au with HTTPS (Let's Encrypt auto-renewing)
- DNS migrated Wix → Netlify; Google Workspace MX untouched
- Referral pipeline live (Netlify Form → Function → Resend → `hello@fwdhealth.com.au`)
- Dedicated `/refer-success` thank-you page
- Mobile menu drawer working
- Hero pattern (heading + image side-by-side) propagated to all service pages
- Practitioner-card lightbox modals working on team page AND service pages
- All Book online buttons now open Cliniko in a new tab (no more in-page iframe)
- Google Search Console verified
- 2 sitemaps submitted (apex + www variants), Status: Success
- 6 priority URLs sent to indexing queue
