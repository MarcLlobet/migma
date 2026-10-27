# Migma homepage: performance prototype

Two Next.js versions of the [migma.ai](https://migma.ai) homepage with **identical layout and copy**, so the only differences are architectural:

| | `before/` (as today) | `after/` (optimized) |
|---|---|---|
| Rendering | Prerendered, but one `"use client"` boundary at the top, so **the whole page hydrates** | **Server Components**; only the prompt box and mobile menu are client islands |
| Logo | Animated GIF, ~650 KB, preloaded in `<head>` | Animated SVG, 2 KB |
| Hero background | 111 KB WebP image + 29 KB noise PNG | CSS gradients |
| Prompt placeholder | JS typewriter (React state every 40 ms) | Static placeholder |
| Scroll reveals | JS (IntersectionObserver + state); sections are invisible until hydration | CSS scroll-driven animation, zero JS |
| Info tooltips | React state | Native `<details>` |

Shared markup, styles and copy live in `packages/ui`.

## Lab results

Mobile emulation: 412×823, 4× CPU slowdown, Slow 4G (150 ms RTT, 1.6 Mbps). Median of 5 runs.

| Metric | Before | After | Change |
|---|---|---|---|
| FCP | 608 ms | 572 ms | −6% |
| LCP | 608 ms | 572 ms | −6% |
| **Page fully loaded** | **4,595 ms** | **826 ms** | **−82%** |
| Total Blocking Time | 48 ms | 60 ms | noise |
| INP (lab estimate) | 56 ms | 56 ms | 0% |
| **Transferred** | **864 KB** | **68 KB** | **−92%** |
| …of which images | 793 KB | 1 KB | −100% |

**Reading it:** the asset and rendering changes cut the download by 92% and make the page finish loading 5× faster on mobile data. First paint barely changes because both versions send prerendered HTML.

Interactivity is equal here because this replica ships only ~60 KB of JS. Production ships **~1.1 MB of first-party JS plus ~25 third-party tracking domains** (two session recorders, ad pixels), which this replica does not include. That is where the field INP of 833 ms comes from, so trimming JS and third parties is the next step after these changes. TTFB (1.8 s in the field) can't be measured locally either: it depends on caching the prerendered HTML at the Cloudflare edge.

## Run the Next.js apps

```bash
npm install
npm run build
npm run start:before   # http://localhost:3001
npm run start:after    # http://localhost:3002
```

To compare with PageSpeed Insights, deploy each folder as its own Vercel project (Root Directory: `before` or `after`) and run both URLs on [pagespeed.web.dev](https://pagespeed.web.dev) with the Mobile tab.

## Re-run the lab benchmark

The benchmark builds both pages the way Next ships them (prerendered HTML + full-page hydration vs. island hydration) with esbuild and React's server renderer, then measures them in throttled Chromium.

```bash
npm install
npx playwright install chromium
npm run bench            # writes bench/results/results.md
```

Caveats: real Next.js adds its router runtime to both versions and inlines an RSC payload in the HTML (slightly larger for `after`). The lab numbers are for comparing the two approaches, not a prediction of PageSpeed scores.

## Assets

`before/public/images/*` are generated stand-ins matched to production's format, dimensions and byte weight (`python3 scripts/make-assets.py`). No production files are copied. Gallery thumbnails and the founders photo are CSS placeholders in both versions.

---

Performance prototype prepared for Migma. Not the production site; pages are set to `noindex`.
