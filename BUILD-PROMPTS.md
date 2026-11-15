# CityH2O.com — Phase-wise Build Prompts

Reusable prompts to rebuild or extend the site. Each phase is self-contained; run them in order.
Constants for every phase:
- Domain: `cityh2o.com` · Repo: `WEBWORKSA1/cityh2o-com` · Host: GitHub Pages, `main` branch, root
- AdSense client: `ca-pub-6620975821265271` (script in `<head>` of every page; `ads.txt` at root)
- Top bar on every page: "Contact, if you are interested in this website/domain name/Sponsorship/Advertisement/Partnership" → `https://web.works/contact`
- All forms deliver to the owner's single private inbox. **The address must never appear in source** — store it XOR-encoded and reversed in JS and decode at submit time (FormSubmit AJAX). `data-mail` links decode on click.
- No trademark use of "cityh2o" — include a non-affiliation trademark & copyright page.

---

## Phase 1 — Strategy & research
> Research the "city tap water" niche. Audit at least 35 sites (utility lookups, water-test sellers, filter dealers, lead marketplaces, water nonprofits, regulators). Capture lookup UX, lead forms (fields, steps), donation UX, trust signals, content types. Verify current EPA/Health Canada limits (lead LCRI, PFAS 4 ppt status, hardness scale, boil guidance). Output `RESEARCH.md` with a concept decision table and a feature synthesis.

## Phase 2 — Architecture & design system
> Create a Jekyll site that GitHub Pages builds natively (no plugins). `_layouts/default.html` (head meta, OG, JSON-LD WebSite+Organization, AdSense script, theme pre-paint, top bar, sticky header, mobile menu, CTA band, 5-column footer with newsletter, cookie notice) and `_layouts/guide.html` (breadcrumbs, auto TOC, dated byline, lead CTA). One CSS file with tokens, light/dark themes, glass hero card, animated SVG wave, cards, chips, forms, multi-step steps, tool results, accessible focus states, reduced-motion support. Fonts: Plus Jakarta Sans + JetBrains Mono.

## Phase 3 — Data layer
> `_data/cities.json`: 60+ cities (US, CA, UK, FR, AU) with utility, source water, USGS hardness band 1–4 and a factual note. `_data/contaminants.yml`: 13 contaminants with US limit, Canada guideline, sources, health, fix, NSF standard, tech tags. Expose `/data/cities.json` via Liquid `jsonify` for client search. Never invent numeric contaminant results for cities; link to the official report instead.

## Phase 4 — Core pages
> Home (hero city search with autocomplete, hardness snapshot widget, 4 intent cards, inline lead form, tools grid, live news, fact/tip/rule-watch cards, guides, videos, contest/support/pros strip, FAQ with FAQPage schema). Cities (server-rendered `<details>` cards, filters by text/hardness/country, deep links `#city-id`, per-city lead CTA). Contaminants (searchable accordion + filter-technology table).

## Phase 5 — Interactive tools
> `tools.html` + `tools.js`: lead risk self-check (scored, child/pregnancy override), hardness converter (mg/L, gpg, °dH, °fH, mmol/L), leak cost (drip rate → gallons/$), bottled vs tap, household use by fixture with efficient-fixture savings, softener payback. `filter-finder.html` + `finder.js`: source, multi-concern, scope, renter/owner, budget → ordered setup with certification and cost, then a prefilled lead form carrying the recommendation in a hidden field.

## Phase 6 — Lead generation engine
> `get-tested.html`: 6-step form (concern → source → home details → desired help → timeline/budget → contact + consent), auto-advance on radio steps, progress bar, URL prefill (`?city=&concern=&from=`), thank-you panel. Short form on home; once-per-visitor scroll nudge (after cookie choice, never on lead pages). `pros.html`: B2B application (services, territory, licences, volume) for selling leads to max 3 certified pros.

## Phase 7 — Monetization & community
> `support.html` donation tiers with impact copy, monthly/one-time, designation (tests for families, data, prize fund, hiring), honest progress bar; `_config.yml: donate_url` switches pledge → instant checkout. `advertise.html` sponsorship packages + inquiry (incl. acquisition). `contest.html` + `rules.html` (no purchase necessary, eligibility, skill-testing question for Canada, judging weights, prizes from `_config.yml`). `careers.html` roles + talent form.

## Phase 8 — Content for AdSense approval
> 9+ original long-form guides (700–1,100 words, tables, internal links, dated): reading a CCR, lead, PFAS 2026, hard water, filter certifications, well testing, boil advisories, cutting your water bill, tap vs bottled. Plus About, Editorial policy (sources, corrections, AI-use disclosure), Privacy (Google partner-sites link, opt-out links, GDPR/CCPA/PIPEDA rights), Cookies table, Terms, Disclaimer, Trademark & ©, Contact.

## Phase 9 — Automation (self-updating)
> `scripts/update_news.py` (stdlib only): Google News RSS queries for lead, PFAS, boil advisories, utilities, policy, Canada + Circle of Blue; topic classification, de-duplication, 45-day window, 120 items → `data/news.json`. `.github/workflows/update-news.yml`: daily cron + manual + on push, `contents: write`, commit only on change. Client renders with topic chips and "Updated" stamps. Daily rotating fact, monthly tip, sitemap `lastmod` from build time.

## Phase 10 — SEO, compliance, QA, deploy
> `sitemap.xml` and `feed.xml` via Liquid, `robots.txt` (allow Mediapartners-Google), `ads.txt`, `CNAME`, manifest, SVG favicon/OG, 404 with search. QA: Liquid syntax, internal links, JS syntax, headless screenshots desktop/mobile, `grep` to prove the inbox address never appears. Push to `main`, enable Pages (Settings → Pages → Deploy from branch → main / root), add DNS, enforce HTTPS, submit sitemap to Search Console, apply to AdSense.

## Phase 11 — Growth roadmap (next)
> Programmatic-but-substantive city pages (only once each has ≥400 words of unique, sourced content), state/province hubs, PFAS & lead-line maps (Leaflet + public datasets), email automation for the Tap Report, Stripe payment links, sponsor slots per city, Spanish & French versions.
