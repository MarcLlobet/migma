# Migma homepage: performance prototype

A rebuild of the [migma.ai](https://migma.ai) homepage focused on mobile performance. Same sections and copy as the live page; the reference to compare against is **migma.ai itself**.

**Live prototype:** https://marcllobet.github.io/migma/

## What's different from migma.ai

| | migma.ai (Oct 2026) | This prototype |
|---|---|---|
| Rendering | Whole page hydrates as client JS | Server Components, static HTML; only the prompt box and mobile menu ship JS |
| Hosting | Prerendered, but HTML not cached at the edge (`cf-cache-status: DYNAMIC`) | Static files on a CDN (GitHub Pages) |
| Hero background | 111 KB WebP + 29 KB noise PNG | CSS gradients (the image becomes the LCP element and cost a point in testing) |
| Scroll reveals, tooltips | JavaScript | CSS scroll-driven animations, native `<details>` |
| Third parties | ~25 tracking domains | None |

## Compare

Run both on [PageSpeed Insights](https://pagespeed.web.dev), **Mobile** tab:

- https://pagespeed.web.dev/analysis?url=https://migma.ai/
- https://pagespeed.web.dev/analysis?url=https://marcllobet.github.io/migma/

Compare the **lab** section ("Diagnose performance issues"). The prototype has no real-user (field) data, and migma.ai's field data covers 28 days of real visits, so only lab vs lab is a fair comparison.

**Caveats:** this is not a feature-complete copy. The gallery thumbnails and founders photo are CSS placeholders, the prompt doesn't do anything, and there are no analytics or ad pixels. It shows what the page *could* weigh, not a drop-in replacement. The page is indexable but declares migma.ai as its canonical URL, so search engines treat the original as the main page.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export in ./out
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the static export and publishes it to GitHub Pages.

---

Performance prototype prepared for Migma. Not the official site.
