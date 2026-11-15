# CityH2O.com — Niche & Competitor Research

## 1. Concept decision

**Domain read:** "City H2O" = city water. The strongest monetizable intent around that phrase is **"Is my city's tap water safe / what's in it / which filter do I need."**

| Candidate concept | Search intent | AdSense CPC tier | Lead value | Verdict |
|---|---|---|---|---|
| **City tap-water intelligence + water-check lead gen** | Very high (lead, PFAS, hard water, boil notices, CCRs) | High (water filtration, softeners, plumbing, testing) | **High** — dealers pay well for qualified softener / RO / whole-house / lead-line leads | **Chosen** |
| Water-bill comparison by city | Medium | Low–medium | Low | Folded in as tools |
| Water utility jobs board | Low | Medium | Low | Folded in as careers |
| Bottled-water delivery directory | Medium | Medium | Medium | Rejected — commodity, affiliate-heavy |

**Why it wins:**
- Evergreen + news-driven traffic spikes (lead-line replacement deadlines through 2037, PFAS compliance 2029–2031, boil advisories).
- Every page has a natural, non-spammy lead CTA ("get your water checked").
- Three revenue streams on the same traffic: AdSense, pay-per-lead from certified pros, sponsorships — plus donations.

## 2. Verified regulatory facts used on the site (checked Nov 2026)
- PFOA & PFOS MCL **4 ppt** (April 2024 rule). May 18 2026 EPA proposals keep 4 ppt, allow extension of compliance 2029 → 2031 for qualifying systems, and propose rescinding PFHxS, PFNA, HFPO-DA and Hazard Index limits.
- Lead & Copper Rule Improvements: action level **15 → 10 ppb**, compliance **Nov 1, 2027**; lead/GRR service lines replaced within 10 years.
- Health Canada lead MAC 5 µg/L; PFAS objective 30 ng/L (sum of 25).
- USGS hardness scale: soft 0–60, moderate 61–120, hard 121–180, very hard >180 mg/L; 1 gpg = 17.1 mg/L.
- CDC: test private wells at least yearly; boil 1 min (3 min above 6,500 ft).
- EPA CCR finder: https://sdwis.epa.gov/fylccr

## 3. Competitor / reference audit (35 sites)

Legend: **F** = fetched and audited directly during research · **D** = desk review from search results and known public features.

| # | Site | Type | Features worth copying | Src |
|---|---|---|---|---|
| 1 | tapwaterdata.com | Lookup | ZIP lookup, lead/PFAS/hardness maps, hardness calculator, softener cost estimator, boil advisory lookup, state pages, contaminant DB, rankings, paid report, B2B data sales, newsletter | F |
| 2 | crystalquest.com (lead lookup) | Seller + tool | Lead lookup with color-coded classification, "what's next" CTAs, action table per level, newsletter opt-in | F |
| 3 | epa.gov/ccr | Regulator | CCR finder, consumer basics | F |
| 4 | mytapscore.com | Testing | "Customize my kit" quiz, 4-step how-it-works, tiered kits, trust badges (ISO 17025), FAQ, testimonials | F |
| 5 | culligan.com | Dealer | ZIP + area-of-interest lead form, free consultation, "take the quiz", reviews, dealer locator, franchising | F |
| 6 | circleofblue.org | Nonprofit news | Topic hubs, monthly/one-time/annual donate, multiple newsletters, data dashboards, podcasts | F |
| 7 | epa.gov/watersense | Program | Product search, rebate finder, Fix a Leak Week, pledge, home checklist | F |
| 8 | wqa.org | Trade assoc. | Find-a-pro directory, Gold Seal certification, consumer learn hub | F |
| 9 | leafhome.com (water) | Dealer | Free water test offer, 1-day install, referral rewards, review counts | F |
| 10 | cdc.gov drinking water | Agency | Well testing cadence, plain-language safety | F |
| 11 | ewg.org/tapwater | Nonprofit DB | ZIP / utility search, "health guideline" comparisons, donate prompts | D |
| 12 | clearlyfiltered.com quiz | Seller | ZIP → contaminants → product recommendation quiz | D |
| 13 | bluewatergroup.com checker | Seller | ZIP checker vs health standards | D |
| 14 | nypirg.org/whatsinmywater | Nonprofit | ZIP → system list → threat map | D |
| 15 | usgs.gov PFAS tap map | Agency | Interactive PFAS risk map + how-to video | D |
| 16 | water.org | Charity | Impact-per-dollar donation tiers, monthly default | D |
| 17 | charitywater.org | Charity | Story-led giving, progress bars, birthday campaigns | D |
| 18 | nsf.org (consumer) | Certifier | Certified product listings by contaminant | D |
| 19 | iapmo.org | Certifier | Listing directory | D |
| 20 | waterfilterguru.com | Affiliate | Contaminant pages, filter reviews, comparison tables | D |
| 21 | kinetico.com | Dealer | Free water analysis form, dealer locator | D |
| 22 | rainsoft.com | Dealer | Free in-home test lead form | D |
| 23 | aquasana.com | Brand | Water quality report lookup, quiz, subscriptions | D |
| 24 | brita.com | Brand | Filter replacement reminders, sustainability messaging | D |
| 25 | homeadvisor.com / angi.com | Lead marketplace | Multi-step quote funnels, "3 pros" matching, pro sign-up | D |
| 26 | thumbtack.com | Lead marketplace | Pro onboarding, territory selection | D |
| 27 | simplelab.com | Testing (B2B) | Utility/landlord testing programs | D |
| 28 | awwa.org | Utility assoc. | Lead service line resources, videos | D |
| 29 | nrdc.org (water) | Advocacy | Explainers + donate | D |
| 30 | flintwaterstudy.org | Research | Data-driven storytelling | D |
| 31 | waterbenchmark / state CCR portals | Data | Utility-level data tables | D |
| 32 | practical.engineering | Media | High-retention engineering explainers (video source) | D |
| 33 | wateronline.com | Trade news | Daily news feed, newsletters | D |
| 34 | smartwatermagazine.com | Trade news | Global water news, categories | D |
| 35 | healthycanadians / canada.ca water | Agency | Canadian guidelines tables | D |

## 4. Feature synthesis → what CityH2O ships
- City lookup (61 profiles, server-rendered for SEO) + autocomplete search
- Contaminant library (13) with U.S. **and** Canadian limits + NSF standard to look for
- Filter Finder quiz → recommendation → lead form (prefilled)
- 6 calculators (lead risk, hardness, leak, bottled vs tap, usage, softener payback)
- 6-step free water check funnel (primary lead gen) + homepage short form + exit-style nudge
- Pro network application (B2B lead buyers), advertising/sponsorship inquiry
- Donations (tiers, monthly/one-time, designation, `donate_url` switch), contest with official rules, careers talent pool
- Daily auto-updated news (GitHub Actions), rotating fact/tip, video library (click-to-load)
- Full compliance pages for AdSense: privacy (Google partner-sites disclosure), cookies, terms, disclaimer, editorial policy, trademark/©, about, contact
