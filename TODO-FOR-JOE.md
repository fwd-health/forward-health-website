# Things you need to provide / decide

Live state of the build, what's still missing, and the strategy notes behind the calls I've made.

> **As of 2026-05-11 (after your latest round of answers):** 7 commits landed — 22 pages, 14 practitioners (incl. Maddie + Suzie), real Google Maps embeds on both clinic pages, full Bribie Island SEO page with Schema markup, Cliniko booking, mobile nav, lightbox modals. Build is clean (`npm run build`). Dev server: http://127.0.0.1:4321.

## 📸 Photos still needed

| What | Status | Where it lands |
| --- | --- | --- |
| **Currimundi clinic** — exterior + interior + reception | Currently using a single Google Business Profile photo as a stand-in on `/locations/currimundi` and `/locations`. Want better, properly-lit photography (exterior, reception, treatment room, ideally a Pilates / wundachair shot too) to bring it up to parity with the Sandstone Point clinic photo strip. | Hero + photo strip on `/locations/currimundi`, location card on `/locations` |
| **Mums & Bubs homepage teaser** | Currently reuses the pregnancy-physio shot. Want something that captures both mum *and* bub together (postnatal, milestone session, in-clinic with baby on lap, etc). | Mums & Bubs callout on `/` |
| **Practitioner lifestyle photos** — for each lightbox | Most practitioners now wired (Brianna, Carly, Catalina, Ella, Holly, Jarrod, Joe, Lucy, Steph, Suzie). Still missing: Tara, Erin, Maddie. Drop into `src/assets/team/personal/<firstname>/` and tell me. | Lightbox modals on `/team` |
| **Mums & Bubs imagery** *(nice to have)* | Currently reuses the homepage hero on `/mums-and-bubs` — fine for launch | `/mums-and-bubs` hero |
| **Run Club action shot** *(nice to have)* | Currently uses the corgi-mascot poster + "All For Run" art. A real candid run-club shot would round it out | `/run-club` |

## ⏰ Content gaps still needed from you

- **Opening hours per clinic per day** — you mentioned they vary. Drop me the actual times and I'll wire them into `/contact` and `/policies`. Right now `/contact` has placeholder text.

## 📌 On the radar (not blockers, but flagged for a future round)

- [ ] **Careers page team picture** — current hero is the pottery class shot; would be good to swap to a more recent full-team photo when one's available.
- [ ] **Colour scheme refresh** — open to taking the palette somewhere brighter / more vibrant than the current sage + cream + tan. Worth a design pass once the structure is settled.
- [ ] **Homepage hero** — currently the Running Assessments 3 shot. Open to swapping again when a stronger hero candidate emerges (something that pops even more on first load).

## ✅ Recent answers locked in

- **Maddie McCulloch** — added to `/team` (CCC, Currimundi) and `/locations/currimundi` with her professional headshot. Photo was sideways from iPhone HEIC; rotated and converted to JPG.
- **Drive times to Bribie Island** — confirmed (~5 min Bongaree, ~8 min Banksia Beach, ~12 min Woorim).
- **Ella Gubesch** — included as "currently on maternity leave".
- **Suzie Irwin** — full bio + temp headshot + beach lifestyle photo in. Slots into `/remedial-massage` and `/team`.

## 🗺️ Maps now embedded

Wired `MapEmbed.astro` on both location pages — uses the address-query Google Maps embed (no API key needed, free, works immediately). If you ever want richer behaviour (custom marker, branded styling), we can swap to the Maps JS API with a key later — same component, different src.

## ☁️ Hosting recommendation: **Netlify**

I picked Netlify for the launch. Reasoning:

- **Your `public/_redirects` file is already in Netlify's format** — no rewriting needed at cutover.
- **Free tier covers Forward Health comfortably** (100GB bandwidth/month; you'll use a fraction of that).
- **Netlify Forms** built in — when you eventually want a contact form, no backend code required, submissions land in your Netlify dashboard and trigger an email.
- **Simple deploy**: connect this Git repo, Netlify auto-deploys every push. No CLI gymnastics.
- **Branch previews** — every PR gets its own preview URL, useful when Steph wants to review a copy change before it goes live.
- **DX is non-developer-friendly** — the Netlify dashboard is more approachable than Vercel's for someone running a business who isn't writing code daily.

Vercel is also excellent. I picked Netlify on the margin because of the `_redirects` format + Forms + the simpler dashboard. Both are free and would work fine.

**Next step for you (5 minutes):** sign up at netlify.com → "Add new site → Import from Git" → connect this GitHub/GitLab repo → it auto-detects Astro and deploys. You'll get a `*.netlify.app` URL before DNS flip; that's where we'll verify everything works before pointing fwdhealth.com.au at it.

## 📧 Email verification — what I meant and what to do

The risk: when DNS for `fwdhealth.com.au` flips from Wix to Netlify, anything that was routed via Wix's nameservers stops working. **Including email**, if your mailbox lives with Wix.

Specifically, `hello@fwdhealth.com.au` needs MX records to keep working. MX records tell the world "to deliver mail for fwdhealth.com.au, talk to *this* server." If we change DNS without preserving the MX records, mail bounces and you lose customer enquiries.

**Action steps (5 mins):**

1. Open your email — wherever you currently read `hello@fwdhealth.com.au` from. Is it Gmail/Google Workspace, Microsoft 365, Wix Mail, or somewhere else? **Tell me which.**
2. Go to whatever service hosts your domain DNS (you mentioned Wix is currently doing this) and screenshot the MX records currently set. Or read out the lines that look like `@ MX 10 something.com` or `MX 10 something`.
3. If MX records exist and point at something other than `*.wix.com`, you're probably safe — that mailbox is hosted elsewhere and we just need to copy those MX records to Netlify's DNS when we switch.
4. If MX records point at `*.wix.com` or you're using Wix's built-in inbox, **migrate to Google Workspace or Microsoft 365 before we switch DNS**. Both are ~$8–10/user/month and take ~15 min to set up.

The TL;DR — I just need you to tell me: *"`hello@fwdhealth.com.au` is hosted by [X]"*. Once I know, I can write the exact DNS records we need to carry over.

## 🤰 Mums & Bubs: why I baked it in (Phase 1) instead of spinning out

Short version: **I kept it as a section within Forward Health for now, with the option to spin out later once it earns its own traffic.** Here's the reasoning:

### Why spin out is appealing
- Distinct brand identity for the niche
- Marketing focus — paid ads / Instagram / parent groups feel cleaner when the brand is laser-niche
- Steph's own thing — both psychologically (own her project) and commercially (her own asset to grow / one day sell)

### Why I didn't do that yet

**1. SEO authority cost is real.**
Forward Health has existing trust signals: established practice, GBP reviews, ranking for "Forward Health vertigo physio" already. A new domain (`mumsandbubsphysio.com.au`) starts at zero. Google takes 6–12 months to trust new domains for medical queries. Patients searching "pelvic floor physio Sunshine Coast" today *find* Forward Health, not a brand-new site. Spinning out splits that authority.

**2. Mums & Bubs at Forward Health *is* the differentiator.**
The unique sell isn't "we're a pelvic-floor-only clinic" — it's "the same physio who saw you through pregnancy is the one who'll see your bub." That story actually requires both services living under one roof. A separate Mums & Bubs site has to explain "but yes, when your toddler is six and falls off a scooter, we'll send you back to Forward Health." That's friction.

**3. Operational cost.**
Two websites = two CMSes, two GBPs to maintain, two booking flows to monitor, two sets of analytics. Single-physio practice can afford one. Two is a fixed cost that grows monthly without much upside until traffic justifies it.

**4. Reversibility.**
Phase 1 is cheap to undo. If in 12 months Mums & Bubs is generating enough independent search demand, we register `mumsandbubsphysio.com.au` ($15), spin up a standalone site, and 301-redirect the existing `/mums-and-bubs` section to it. We capture the SEO link equity from the current section and transfer it cleanly. Doing it the other way around — starting separate, then merging back — wastes 6–12 months of brand-building.

### My recommendation

- **Now → 6 months**: keep `/mums-and-bubs` as a section under Forward Health. Build the sub-brand visually (sage callouts, Steph + Brianna fronted, dedicated journey timeline). Track its share of search traffic and bookings.
- **Register `mumsandbubsphysio.com.au` defensively** (~$15/year, takes 2 min at any registrar) so no one else grabs it. Park it or 301 it to `/mums-and-bubs`.
- **6 months in**, look at: is "mums and bubs physio" generating search clicks of its own? Is Steph's caseload caseload-justifying a dedicated room? Then spin out.

If you'd rather go straight to a separate brand now, I can rip the section out and we treat it as future work. But my read is Phase 1 is the more conservative, higher-yield call. Happy to be talked out of it.

## 🔌 Technical TODOs

**✅ Done:**
- Sanity Studio scaffold ready for `npx sanity init`
- Sitemap, `robots.txt`, favicon, OG default image, theme colour, brand-aligned 404
- 301 redirect map (`public/_redirects` Netlify format, also documented in `REDIRECTS.md`)
- Privacy / Policies / Careers / Pricing pages
- MedicalOrganization JSON-LD sitewide + FAQPage JSON-LD on every service page + Physiotherapy schema with `areaServed` on the Bribie page
- Maps embeds wired with `MapEmbed.astro` component

**Still pending (need you):**
- Tell me who hosts `hello@fwdhealth.com.au` (see Email verification section above)
- Sign up at Netlify and connect this Git repo (5 min)
- Once Maddie/Suzie pro photos arrive, drop them at `src/assets/team/maddie.jpg` and `src/assets/team/suzie.jpg` respectively
- Send the per-clinic opening hours for `/contact` and `/policies`
- Currimundi clinic photos
- Run `npx sanity init` inside `sanity-studio/` when you have 5 minutes (optional for launch — needed only when you want non-dev content editing)

## 🧩 What's working right now

**22 pages, all building cleanly:**
- `/` (homepage with pregnancy-physio hero + 8-service grid + Run Club teaser + Mums & Bubs teaser + locations)
- `/services` index + 8 service pages
- `/team` with 14 practitioner headshots + click-to-open lightbox modals + "Behind the clinic" team-events gallery
- `/locations` index + `/locations/currimundi` + `/locations/sandstone-point` (both with embedded Google Maps; Sandstone has clinic + studio photo strip)
- `/run-club` with corgi mascot poster + "All For Run" art + sessions schedule
- `/physiotherapy-bribie-island` with neighbourhood callouts, drive times, and Schema.org markup
- `/mums-and-bubs` (Phase 1 sub-section)
- `/contact` + `/pricing` + `/privacy` + `/policies` + `/careers`

You can run `npm run dev` to preview locally at http://127.0.0.1:4321. Production build: `npm run build`.
