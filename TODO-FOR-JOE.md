# Things you need to provide / decide

Stuff I couldn't do without input from you.

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

## 🔌 Technical TODOs (I can do these — flagging so you know)

- [ ] Sanity Studio scaffold (content management for non-developer edits later)
- [ ] Sitemap + robots.txt (auto-generated via @astrojs/sitemap)
- [ ] Favicon
- [ ] OG share images per page (homepage + key landing pages)
- [ ] 301 redirect map for the Wix → new site cutover
- [ ] Google Maps embeds (need API key OR use the iframe-share format)
- [ ] Privacy / Policies / Careers pages (currently the footer links 404)
- [ ] Form submission handler for the Contact page (or keep CTAs as call/email only)

## 🧩 What's working right now

- 18 pages compiled cleanly in `npm run build`
- Real photos throughout (8 service heroes, hero on homepage, sandstone point clinic + studio, run club poster, all 12 practitioner headshots, behind-the-clinic gallery)
- Cliniko booking iframe live on every page
- Lightbox modals on team page (close on Escape, backdrop click, or × button)
- Mobile hamburger nav
- 8 services in the right order, footer service list mirrors it
- Schema.org `Physiotherapy` markup on the Bribie Island page with proper `areaServed`

You can run `npm run dev` to preview locally at http://127.0.0.1:4321 — it should already be running.
