// Turns the captured migma.ai page (snapshot/source) into files the site serves.
//   - asset URLs (images, fonts) → local paths under public/snap/, prefixed with __BASE__
//     (replaced by the GitHub Pages base path at build time)
//   - internal links → absolute https://migma.ai links, so clicks go to the real site
//   - writes snapshot/page.html, snapshot/styles.css, snapshot/assets.json
// Usage: node scripts/snapshot/build.mjs

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const src = path.join(root, "snapshot/source");
const ORIGIN = "https://migma.ai";

const meta = JSON.parse(await readFile(path.join(src, "meta.json"), "utf8"));
let html = await readFile(path.join(src, "body.html"), "utf8");
let css = await readFile(path.join(src, "styles.css"), "utf8");

// ---------- remove runtime-only elements ----------
// Seasonal "send" effect injected by JS (frozen at its capture position, it stretches the page).
html = html.replace(/<span[^>]*halloween-send-effect[^>]*>[\s\S]*?<\/span>/g, "");

// ---------- asset URL → local file ----------
const assets = {}; // absolute URL → path relative to public/
function localPath(abs) {
  const u = new URL(abs);
  if (u.pathname === "/_next/image") {
    // Next.js image optimizer: one file per requested width.
    const orig = decodeURIComponent(u.searchParams.get("url"));
    const w = u.searchParams.get("w");
    return `snap/img${orig}.w${w}.webp`;
  }
  const host = u.host === "migma.ai" ? "" : `/${u.host}`;
  return `snap${host}${decodeURI(u.pathname)}`;
}
for (const a of [...meta.assets, ...meta.cssAssets]) assets[a] = localPath(a);

const decode = (s) => s.replace(/&amp;/g, "&");
const encode = (s) => s.replace(/&/g, "&amp;");
const toLocal = (raw) => {
  const abs = new URL(decode(raw), ORIGIN).href;
  return assets[abs] ? `__BASE__/${assets[abs]}` : null;
};

// src / poster / image href
html = html.replace(/\b(src|poster)="([^"]+)"/g, (m, attr, v) => {
  if (v.startsWith("data:")) return m;
  const l = toLocal(v);
  return l ? `${attr}="${encode(l)}"` : m;
});
// srcset
html = html.replace(/\bsrcset="([^"]+)"/g, (m, v) => {
  const out = decode(v).split(",").map((part) => {
    const [url, size] = part.trim().split(/\s+/);
    const l = toLocal(url);
    return `${l ?? url}${size ? " " + size : ""}`;
  });
  return `srcset="${encode(out.join(", "))}"`;
});
// href: assets (svg <image>) → local; internal pages → absolute migma.ai
html = html.replace(/\bhref="([^"]*)"/g, (m, v) => {
  if (!v || v.startsWith("#") || /^(mailto|tel|data):/.test(v)) return m;
  const l = toLocal(v);
  if (l) return `href="${encode(l)}"`;
  if (v.startsWith("/")) return `href="${ORIGIN}${v}"`;
  return m;
});
// inline style url(...)
html = html.replace(/url\((&quot;|["']?)([^)"']+)\1\)/g, (m, q, v) => {
  if (v.startsWith("#") || v.startsWith("data:")) return m;
  const l = toLocal(v);
  return l ? `url(${q}${l}${q})` : m;
});
// CSS url(...)
css = css.replace(/url\(["']?([^)"']+)["']?\)/g, (m, v) => {
  if (v.startsWith("data:") || v.startsWith("#")) return m;
  const l = toLocal(v);
  return l ? `url("${l}")` : m;
});

// ---------- performance changes that keep the design identical ----------
// Logo: serve the ~50 KB animated AVIF (scripts/snapshot/optimize-logo.sh) instead of
// the 651 KB GIF; browsers without AVIF still get the GIF. display:contents keeps layout.
html = html.replace(/<img([^>]*?)src="__BASE__\/snap\/images\/MigmaAI\.gif"([^>]*)>/g,
  '<picture style="display:contents"><source srcset="__BASE__/snap/images/MigmaAI.avif" type="image/avif"><img$1src="__BASE__/snap/images/MigmaAI.gif"$2></picture>');

// Any asset URL left un-rewritten?
const leftovers = [...html.matchAll(/(?:src|srcset)="([^"]*(?:\/_next\/image|cdn\.migma\.ai|^\/images)[^"]*)"/g)].map((m) => m[1]);

await writeFile(path.join(root, "snapshot/page.html"), html);
await writeFile(path.join(root, "snapshot/styles.css"), css);
await writeFile(path.join(root, "snapshot/assets.json"), JSON.stringify(assets, null, 2));
console.log(`page.html ${Math.round(html.length / 1024)} KB · styles.css ${Math.round(css.length / 1024)} KB · ${Object.keys(assets).length} assets · leftovers: ${leftovers.length}`);
