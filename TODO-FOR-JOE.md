# Things you need to provide / decide

Stuff I couldn't do without input from you.

> **Overnight state (2026-05-11):** 4 commits landed — 22 pages, real photography, Cliniko booking, mobile nav, lightbox modals, Sanity Studio scaffold, sitemap, redirect map, FAQ + MedicalOrganization JSON-LD. See "What's working right now" at the bottom for the full inventory. The dev server is running at http://127.0.0.1:4321 and a clean build (`npm run build`) passes with all 22 pages.

## 📸 Photos still needed

| What | Why | Where it'll go |
| --- | --- | --- |
| **Suzie Irwin headshot** (RMT, Currimundi, Tuesdays) | Not on the live Wix team page yet, no photo found locally | `/team` page (RMT section) |
| **Maddie McCulloch headshot** (junior CCC, Currimundi) | Same — newer hire, no photo yet | `/team` page (Care Team section) |
| **Currimundi clinic exterior + interior photos** | None of the converted folder photos clearly show the Currimundi reception/exterior. Needed to match the Sandstone Point treatment | `/locations/currimundi` page hero + photo strip |
| **Practitioner personal/lifestyle photos** | The Wix lightbox personal photos turned out to be **team-event photos** (pottery class, sunset trip, etc.) — not individual ones. If you want individual lightboxes to show personal shots (e.g. Tara at the lookout with kids, on the mountain bike), upload them to `src/assets/team/personal/<firstname>/` | Each practitioner's lightbox gallery |

To help with the personal photos: drop files into `src/assets/team/personal/joe/`, `.../steph/`, etc. Then tell me and I'll wire the lightbox to render a swipe-able mini-gallery underneath each headshot.

## 🤔 Decisions / confirmations

1. **Mums & Bubs Phase 1** — I went ahead and built the section page (`/mums-and-bubs`) given the homepage already linked there. Memory note said you hadn't yet confirmed Phase 1 vs Phase 2. Confirm:
   - ✅ Keep as-is (sub-section with own URL)
   - 🔄 Pull it down until decision is made
   - 🚀 Go bigger — separate domain / spin out

2. **Logo footer treatment** — there's now a real white-on-sage logo (`logo-white.png`) wired into the footer. Looks proper now (was CSS-filtered before). Take a look and confirm you're happy.

3. **Ella Gubesch** — I added her as "currently on maternity leave" since you confirmed she's still with you. Check the wording in `src/data/practitioners.ts` (`fullBio` field) sounds right.

## 📝 Content gaps that aren't blockers but would polish things

- **Mums & Bubs imagery** — currently reuses the homepage hero. Has a different feel needed?
- **/run-club photos** — currently uses the corgi mascot poster + "All For Run" art. A real candid run-club action shot would be powerful next to the mascot stuff.
- **/contact page** — assumes opening hours of "Mon–Fri 7am–7pm, Sat 8am–2pm". Confirm or correct.
- **Pricing page** — your live Wix site has one (`/pricing`). Want me to mirror it on the new site?
- **Bribie Island page** — drive times are estimates ("~5 min from Bongaree", etc.). Verify.

## 🔌 Technical TODOs

**✅ Done overnight:**
- Sanity Studio scaffold (in `/sanity-studio` — schemas for service, practitioner, location, condition, partner, faq; ready for `sanity init`)
- Sitemap (`/sitemap-index.xml`) + `robots.txt`
- Favicon (sage "f" mark)
- Default OG share image (homepage hero)
- 301 redirect map (`public/_redirects` for Netlify, also documented in `REDIRECTS.md`)
- Privacy / Policies / Careers pages (footer links resolve)
- `/pricing` page (mirrored from your Wix site)
- MedicalOrganization JSON-LD sitewide + FAQPage JSON-LD on every service page

**Still pending (need you):**
- Google Maps embeds for both location pages (paste the iframe share-link from each Google Business Profile)
- Per-page custom OG images (currently all share the homepage hero — fine for launch)
- Form submission handler for `/contact` if you want a contact form (right now it's call/email only — possibly the right call)
- Sanity init (`cd sanity-studio && npx sanity init` — Sanity needs your account)

## 🧩 What's working right now

**22 pages, all building cleanly:**
- `/` (homepage with pregnancy-physio hero + 8-service grid + Run Club teaser + Mums & Bubs teaser + locations)
- `/services` index + 8 service pages (physiotherapy, pelvic-floor-physio, remedial-massage, running-assessments, vertigo-vestibular-physio, paediatric-physio, clinical-pilates, home-visits)
- `/team` with 12 practitioner headshots + click-to-open lightbox modals (full bio, qualifications, specialties, "Book with X" CTA) + "Behind the clinic" team-events gallery
- `/locations` index + `/locations/currimundi` + `/locations/sandstone-point` (Sandstone Point has clinic + studio photos)
- `/run-club` with corgi mascot poster + "All For Run" art + sessions + tied to running assessments
- `/physiotherapy-bribie-island` with neighbourhood callouts, drive times, and Schema.org Physiotherapy markup with areaServed
- `/mums-and-bubs` (Phase 1 — sage hero, journey timeline, Steph + Bri team)
- `/contact` + `/pricing` + `/privacy` + `/policies` + `/careers`

**Plus:**
- Real photos throughout (homepage hero, 8 service heroes, all 12 practitioner headshots scraped from your live Wix site, Sandstone Point clinic + reformer studio, Run Club poster, 6-photo team gallery)
- Logo image used everywhere (sage on cream for header, white-on-sage for footer — pulled from your live Wix site as a real branded variant)
- Cliniko iframe wired into the booking block on every page (auto-resize script included)
- Mobile hamburger nav with backdrop, Esc-to-close, body lock
- Sanity Studio scaffolded with full schemas — `cd sanity-studio && npm install && npx sanity init` to activate
- Sitemap auto-generated, robots.txt, favicon, OG default image, theme colour
- 301 redirect map staged for Netlify (`public/_redirects`)
- MedicalOrganization JSON-LD sitewide + FAQPage JSON-LD on every service page (rich-snippet eligible)

You can run `npm run dev` to preview locally at http://127.0.0.1:4321. Production build: `npm run build`.
