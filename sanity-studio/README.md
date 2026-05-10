# Forward Health — Sanity Studio

Content management for the Forward Health website. Schemas are scaffolded here ready for `sanity init`.

## When to use this

Right now, all content is hardcoded in `.astro` files and `src/data/practitioners.ts`. That's fast for a launch sprint, but means:
- Joe can't update bios or service blurbs without editing TypeScript
- Stephanie can't reword the Mums & Bubs page without a developer
- Adding a new practitioner means a code change

Sanity solves that. Content lives in a hosted CMS; the Astro site reads from it at build time.

## Setup steps (when you're ready)

```bash
cd sanity-studio
npm install
npx sanity@latest init --bare         # creates a Sanity project, gives you projectId + dataset name
# → save the projectId in sanity.config.ts
npx sanity dev                        # opens Studio at http://localhost:3333
```

Then in the Astro site root:
```bash
npm install @sanity/client @sanity/image-url
# → wire src/lib/sanity.ts to read from your project
# → swap one of the hardcoded pages (e.g. /physiotherapy) to fetch from Sanity
# → repeat for each content type as comfort grows
```

## What's in here

- `sanity.config.ts` — entry point, defines the studio
- `schemas/` — content-type definitions:
  - `service.ts` — physiotherapy, pelvic floor, etc.
  - `practitioner.ts` — team members
  - `location.ts` — Currimundi, Sandstone Point
  - `condition.ts` — vertigo, prolapse, runner's knee, etc. (cross-linked to services + practitioners)
  - `faq.ts` — reusable FAQ blocks
  - `partner.ts` — referral partners (Currimundi Family Doctors, etc.)
- `package.json` — minimal dependency manifest

## Why we scaffolded but didn't init

`sanity init` requires authenticating to your Sanity account and creating a hosted project, which only Joe can do. The schemas can be reviewed/edited before that step.
