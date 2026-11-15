# CityH2O.com

Independent city tap-water guide: city lookup, contaminant library, Filter Finder, calculators, daily water news, and a free water-check lead funnel. Monetized with Google AdSense, pay-per-lead pro network, sponsorships and reader support.

Static Jekyll site — builds natively on **GitHub Pages (free plan, `main` branch, root)**. No plugins, no build step.

## Go-live checklist
1. **Enable Pages:** repo **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`** → Save.
2. **Custom domain:** `CNAME` already contains `cityh2o.com`. At your registrar add:
   - `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www` → `webworksa1.github.io`
   Then tick **Enforce HTTPS** once the certificate is issued.
3. **Turn on the daily news job:** on GitHub choose **Add file → Create new file**, name it `.github/workflows/update-news.yml`, paste the contents of `scripts/update-news.workflow.yml`, and commit. Then Settings → Actions → General → Workflow permissions → **Read and write**. Run "Daily water news refresh" once from the Actions tab.
4. **Forms:** the first form submission triggers a one-time FormSubmit activation email to the owner inbox — click **Activate**.
5. **AdSense:** add the site in AdSense, it will find the head script and `ads.txt`. In **Privacy & messaging**, publish the Google-certified consent message for EEA/UK/CH visitors.
6. **Search Console:** verify the domain and submit `https://cityh2o.com/sitemap.xml`.

## Configuration (`_config.yml`)
| Key | Purpose |
|---|---|
| `donate_url` | Paste a Stripe Payment Link / PayPal / Buy Me a Coffee URL to switch Support from pledge-form to instant checkout |
| `contest_name`, `contest_prize`, `contest_deadline` | Contest copy, rules and countdown |

## Structure
```
_layouts/        default + guide templates
_data/           cities.json (61), contaminants.yml (13)
assets/          css/style.css, js/main.js (core), tools.js, finder.js, img/
guides/          9 long-form guides (+ index)
data/            cities.json (generated), news.json (auto-updated daily)
scripts/         update_news.py (stdlib)
.github/workflows/update-news.yml
```

## Notes
- The owner's inbox is never written in any file; it is encoded in `assets/js/main.js` and decoded only at submit/click time.
- Add a city: append an object to `_data/cities.json` (band 1–4 = USGS soft → very hard). It appears in the lookup, search and homepage snapshot automatically.
- Add a guide: drop a `.md` file in `guides/` with the same front matter as the others (`order`, `category`, `updated`, `read`, `permalink`).

See `RESEARCH.md` and `BUILD-PROMPTS.md`.

© 2026 CityH2O. See `/trademark.html`.
