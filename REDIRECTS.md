# Wix → new site redirect map

Old URL paths → new URL paths. Set these as 301 redirects when DNS flips so we don't lose
existing rankings (especially "Forward Health vertigo physio" which is already ranking).

## How to apply

**Vercel** — add `vercel.json` at project root with a `redirects` array.
**Netlify** — add `_redirects` file in `public/` with one rule per line.
**Both** support 301 by default for redirects.

The `public/_redirects` file below is ready for Netlify; mirrored as `vercel.json` if we end
up on Vercel.

## The map

| Old (Wix) | New | Notes |
| --- | --- | --- |
| `/` | `/` | Homepage |
| `/team` | `/team` | Same path |
| `/pricing` | `/pricing` | Same path |
| `/location-currimundi` | `/locations/currimundi` | Path restructure |
| `/location-sandstonepoint` | `/locations/sandstone-point` | Path restructure |
| `/services` | `/services` | Same path |
| `/contact` | `/contact` | Same path |
| `/physio` *(if exists)* | `/physiotherapy` | |
| `/physiotherapy` *(if exists)* | `/physiotherapy` | Same path |
| `/pelvic-floor` | `/pelvic-floor-physio` | |
| `/womens-health` | `/pelvic-floor-physio` | |
| `/vertigo` | `/vertigo-vestibular-physio` | This is the high-value redirect — preserve "Forward Health vertigo physio" rankings |
| `/vestibular` | `/vertigo-vestibular-physio` | |
| `/paediatric` | `/paediatric-physio` | |
| `/paediatrics` | `/paediatric-physio` | |
| `/running-assessment` | `/running-assessments` | Plural |
| `/clinical-pilates` | `/clinical-pilates` | Same path |
| `/pilates` | `/clinical-pilates` | |
| `/remedial-massage` | `/remedial-massage` | Same path |
| `/massage` | `/remedial-massage` | |
| `/home-visits` | `/home-visits` | Same path |
| `/mobile-physio` | `/home-visits` | |
| `/dry-needling` | `/physiotherapy#dry-needling` | DRY-needling de-prioritised — folds into general physio |
| `/strength-balance` | `/physiotherapy` | Strength & balance kept as supporting service, not lead generator |
| `/hydrotherapy` | `/physiotherapy` | Same |
| `/glad` | `/physiotherapy` | GLA:D no longer offered — remove all references, redirect to general physio |
| `/run-club` | `/run-club` | Same path |
| `/mums-and-bubs` | `/mums-and-bubs` | Same path |
| `/our-team` | `/team` | If Wix uses /our-team |

## Pre-flight checklist before cutover

- [ ] Verify above old URLs are accurate (run a site:fwdhealth.com.au search OR pull from Wix admin sitemap)
- [ ] Add any blog post / news redirects if Wix has them
- [ ] Confirm email hosting for hello@fwdhealth.com.au is migrated FIRST (memory note: `forward_health_business_facts.md` says hosting is TBC — don't break email at cutover)
- [ ] Submit new sitemap to Google Search Console after DNS flip
- [ ] Test every redirect with `curl -I https://www.fwdhealth.com.au/old-path` after cutover
- [ ] Monitor Search Console for 404s and broken-link reports for 4 weeks
