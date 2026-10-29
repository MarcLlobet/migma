# Migma: frontend improvements

Two pieces of work on [migma.ai](https://migma.ai), done from the outside (no access to Migma's code):

1. **[Homepage performance](#1-homepage-performance):** the homepage rebuilt to score 100 on PageSpeed.
2. **[Email checks](#2-email-checks):** automated tests for HTML emails across ~50 email clients.
3. **[Accessibility audit](#3-accessibility-audit):** what Lighthouse's 100 misses on migma.ai, and a plan.

---

## 1. Homepage performance

**Live:** https://marcllobet.github.io/migma/

| PageSpeed | migma.ai (mobile) | This prototype (mobile + desktop) |
|---|---|---|
| Performance | 57 | **100** |
| Accessibility | 100 | **100** |
| Best practices | 96 | **100** |
| SEO | 100 | **100** |

Reports: [migma.ai](https://pagespeed.web.dev/analysis/https-migma-ai/58nlx7boi8?form_factor=mobile) · [prototype](https://pagespeed.web.dev/analysis/https-marcllobet-github-io-migma/snpw4mjndt)

### Changes

Only changes that moved the score were kept. Each was tested on its own.

| Change | migma.ai → prototype | Code |
|---|---|---|
| Server Components | Whole page hydrates as JS → only the prompt box and menu ship JS | [Home.tsx](components/Home.tsx) |
| Cached HTML | Rendered per visit (`cf-cache-status: DYNAMIC`) → static files on a CDN | [next.config.ts](next.config.ts) |
| Inline CSS | Render-blocking stylesheet → CSS inside the HTML | [next.config.ts](next.config.ts) |
| CSS hero | Background image (became the LCP) → CSS gradient | [styles.css](app/styles.css) |
| No hero fade-in | Main text fades in → shows immediately | [styles.css](app/styles.css) |
| No-JS extras | JS scroll reveals and tooltips → CSS animations and `<details>` | [Reveal.tsx](components/Reveal.tsx) · [Info.tsx](components/Info.tsx) |

**Tested and not changed:** the GIF logo. Replacing it with a 2 KB SVG saves 649 KB, but the score stayed the same.

**Caveats:** placeholder images, the prompt doesn't work, and there are no analytics or ad pixels. On migma.ai, trackers should load later, not be removed. The page declares migma.ai as its canonical URL so it doesn't compete in search.

### Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export in ./out
```

Pushing to `main` deploys to GitHub Pages ([deploy.yml](.github/workflows/deploy.yml)).

---

## 2. Email checks

Tests for HTML emails, like unit tests for code. Put emails in [`emails/`](emails) and push: the [Email checks workflow](.github/workflows/email-check.yml) tests each one.

| Check | Catches | Fails the run? |
|---|---|---|
| [caniemail](https://www.npmjs.com/package/caniemail) | HTML/CSS not supported by email clients ([Can I Email](https://www.caniemail.com) data) | Yes, in major clients |
| [doiuse-email](https://www.npmjs.com/package/doiuse-email) | Same data, second opinion | No, warnings only |
| Gmail clipping | HTML over ~102 KB, which Gmail cuts off | Yes |
| Accessibility | Missing `lang`, images without `alt`, layout tables without `role="presentation"` | Yes, for `lang` and `alt` |

**Results** appear in the run's **Summary** tab:
- one table per email: ✅ / ⚠️ / ❌ per check
- a **By client** table: every client × every email

### Settings ([config.json](email-check/config.json))

| Setting | Default | Meaning |
|---|---|---|
| `clients` | `["*"]` | Clients to test (all ~50) |
| `failClients` | Apple Mail, Gmail, Outlook, Yahoo | Only these can fail the run |
| `gmailClipBytes` | 102400 | Size limit |
| `warnOnly` | `<body>`, `role` | Features clients strip harmlessly: reported, never failing |
| `failOn` | | Which checks can fail the run |

### Run locally

```bash
cd email-check
npm install
node check.mjs ../emails
```

---

## 3. Accessibility audit

migma.ai scores 100 for accessibility on Lighthouse, but Lighthouse runs only a few automated checks. Audit of the homepage (Oct 29, 2026) with the full [axe-core](https://github.com/dequelabs/axe-core) rule set, real keyboard navigation, and motion/target checks:

| # | Issue | Evidence | WCAG |
|---|---|---|---|
| 1 | Keyboard focus invisible on many elements | 1.5 px dark-grey outline on near-black (≈1.6:1). The menu button's 3 px light ring is fine. | 2.4.7, 1.4.11 |
| 2 | Logo animates nonstop, can't be paused | 3 looping GIFs; GIFs ignore "reduce motion" | 2.2.2 |
| 3 | Two `<main>` regions, one nested | axe: `landmark-no-duplicate-main` | 2.4.1 |
| 4 | No "Skip to content" link | 77 focusable elements before/around content | 2.4.1 |
| 5 | Small tap targets | Gallery brand buttons are 16 px tall | 2.5.8 |
| 6 | Contrast on gradients unverified | 25 text elements over gradients/images | 1.4.3 |
| 7 | Prompt hint not announced | Rotating example text is visual only | Minor |

**Already good:** the comparison table's ✓/× have screen-reader text, the prompt is a labeled text box, headings are in order, and the page language is set.

### Plan

| When | Do |
|---|---|
| **Quick (~1 day)** | One visible `:focus-visible` ring everywhere · fix the nested `<main>` · add a skip link · logo motion that stops under `prefers-reduced-motion` |
| **Next (~1 week)** | Check text-on-gradient contrast by hand · targets ≥ 24×24 px · verify looping animations stop with "reduce motion" · `aria-placeholder` on the prompt |
| **Keep it fixed** | axe in CI on every pull request · a keyboard + screen reader + 200% zoom pass per release |
| **Beyond the homepage** | Audit the editor (keyboard, screen reader) · AI-written alt text and plain-text versions for generated emails |

Limits: homepage only, tested in Chrome. A VoiceOver/NVDA pass would confirm #3, #4 and #7.

---

## Structure

```
app/, components/, content.ts   Homepage prototype (Next.js)
email-check/                    Email test runner + config
emails/                         Emails to test
.github/workflows/              Deploy + email checks
```

Prototype prepared for Migma. Not the official site.
