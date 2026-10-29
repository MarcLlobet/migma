# Migma: frontend improvements

Two pieces of work on [migma.ai](https://migma.ai), done from the outside (no access to Migma's code):

1. **[Homepage performance](#1-homepage-performance):** the same homepage, 1:1, scoring 97 on mobile instead of 57.
2. **[Email checks](#2-email-checks):** automated tests for HTML emails across ~50 email clients.
3. **[Accessibility audit](#3-accessibility-audit):** what Lighthouse's 100 misses on migma.ai, and a plan.

---

## 1. Homepage performance

**Live:** https://marcllobet.github.io/migma/

A 1:1 copy of the migma.ai homepage: the **same markup, CSS, fonts and images**, captured from the live site. Only the delivery changes. Every section sits at the same pixel position as on migma.ai.

| PageSpeed | migma.ai | Prototype |
|---|---|---|
| Performance (mobile) | 57 | **97** |
| Performance (desktop) | | **99** |
| Accessibility | 100 | **100** |
| Best practices | 96 | **100** |
| SEO | 100 | **100** |

Reports: [migma.ai](https://pagespeed.web.dev/analysis/https-migma-ai/58nlx7boi8?form_factor=mobile) · [prototype](https://pagespeed.web.dev/analysis/https-marcllobet-github-io-migma/cgp8vxxc8o?form_factor=mobile)

### Changes, step by step (mobile score)

| Step | Change | Score | Code |
|---|---|---|---|
| — | migma.ai today | 57 | |
| 1 | Static HTML on a CDN, CSS trimmed to the rules used (430 → 99 KB) and inlined | 74 | [build.mjs](scripts/snapshot/build.mjs) |
| 2 | Logo as animated AVIF instead of GIF (651 → 52 KB, same look) | 90 | [optimize-logo.sh](scripts/snapshot/optimize-logo.sh) |
| 3 | No framework JS in the browser: the page needs no React, so Next's runtime and its second copy of the page (230 KB) are removed; menu + Send are 2 KB of plain JS | **97** | [strip-next-runtime.mjs](scripts/strip-next-runtime.mjs) · [enhance.js](public/enhance.js) |

Desktop went from 84 to 99 with step 3, which removed 280 ms of blocking time.

### How the copy is made

1. **Capture** the rendered page in a browser: markup, CSS (unused rules removed), asset list → [`snapshot/source`](snapshot/source).
2. **Build** ([build.mjs](scripts/snapshot/build.mjs)): asset URLs → local files, links → the real migma.ai.
3. **Download assets** with the [Download snapshot assets](.github/workflows/snapshot-assets.yml) workflow → [`public/snap`](public/snap).
4. **Render** with Next.js at build time ([page.tsx](app/page.tsx)), then strip the client runtime.

**Caveats:**
- **Snapshot date:** Oct 29, 2026. It doesn't update with migma.ai.
- **Interactions:** the menu is a simplified panel, and the "Meet MigmaAI" tabs and feature pop-ups are static. Send and all links go to migma.ai.
- **Trackers:** none. On migma.ai they should load later, not be removed.
- **Visibility:** the page declares migma.ai as its canonical URL so it doesn't compete in search.

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
app/, lib/, public/             Homepage prototype (Next.js, static export)
snapshot/, scripts/snapshot/    Captured migma.ai page + build scripts
email-check/                    Email test runner + config
emails/                         Emails to test
.github/workflows/              Deploy + email checks
```

Prototype prepared for Migma. Not the official site.
