// Lab measurement with Lighthouse-like mobile conditions:
// Moto G Power viewport, 4x CPU slowdown, Slow 4G (150 ms RTT, 1.6 Mbps down).
// For each run: load the page, wait, then tap the prompt and type, open a
// comparison tooltip and the menu, recording Event Timing for an INP estimate.
// Usage: node bench/measure.mjs [runs=5]

import { chromium } from "playwright";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "./serve.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RUNS = Number(process.argv[2] ?? 5);
const VARIANTS = [["before", 4101], ["after", 4102]];

const observer = () => {
  const m = (window.__m = { lcp: 0, fcp: 0, cls: 0, longTasks: [], events: [] });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) m.lcp = e.startTime; })
    .observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === "first-contentful-paint") m.fcp = e.startTime; })
    .observe({ type: "paint", buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) m.cls += e.value; })
    .observe({ type: "layout-shift", buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) m.longTasks.push([e.startTime, e.duration]); })
    .observe({ type: "longtask", buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.interactionId) m.events.push([e.name, e.duration]); })
    .observe({ type: "event", buffered: true, durationThreshold: 16 });
};

async function run(browser, url) {
  const context = await browser.newContext({
    viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true,
    userAgent: "Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false, latency: 150, downloadThroughput: (1638.4 * 1024) / 8, uploadThroughput: (750 * 1024) / 8,
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  const bytes = { total: 0, js: 0, img: 0 };
  const types = new Map();
  cdp.on("Network.responseReceived", (e) => types.set(e.requestId, e.type));
  cdp.on("Network.loadingFinished", (e) => {
    bytes.total += e.encodedDataLength;
    const t = types.get(e.requestId);
    if (t === "Script") bytes.js += e.encodedDataLength;
    if (t === "Image") bytes.img += e.encodedDataLength;
  });

  await page.addInitScript(observer);
  const t0 = Date.now();
  await page.goto(url, { waitUntil: "load" });
  const loadMs = Date.now() - t0;
  await page.waitForTimeout(1500);

  // Interactions a mobile visitor would make in the first seconds.
  await page.tap("#prompt");
  await page.keyboard.type("Black Friday", { delay: 60 });
  await page.tap(".menu-btn");
  await page.tap(".menu-btn");
  await page.locator(".compare .info summary, .compare .info-btn").first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.locator(".compare .info summary, .compare .info-btn").first().tap();
  await page.waitForTimeout(1000);

  const m = await page.evaluate(() => window.__m);
  await context.close();
  const tbt = m.longTasks.filter(([s]) => s >= m.fcp).reduce((sum, [, d]) => sum + Math.max(0, d - 50), 0);
  const inp = Math.max(0, ...m.events.map(([, d]) => d));
  return { fcp: m.fcp, lcp: m.lcp, tbt, inp, cls: m.cls, load: loadMs, kb: bytes.total / 1024, jsKb: bytes.js / 1024, imgKb: bytes.img / 1024 };
}

const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };

const browser = await chromium.launch({ args: ["--enable-blink-features=LayoutInstabilityAPI"] });
const results = {};
for (const [name, port] of VARIANTS) {
  const server = await serve(path.join(root, "bench/dist", name), port);
  const runs = [];
  for (let i = 0; i < RUNS; i++) {
    runs.push(await run(browser, `http://127.0.0.1:${port}/`));
    process.stdout.write(`${name} run ${i + 1}/${RUNS}\r`);
  }
  server.close();
  results[name] = Object.fromEntries(Object.keys(runs[0]).map((k) => [k, median(runs.map((r) => r[k]))]));
  results[name].runs = runs;
}
await browser.close();

const rows = [
  ["FCP", "fcp", "ms"], ["LCP", "lcp", "ms"], ["Page fully loaded", "load", "ms"], ["Total Blocking Time", "tbt", "ms"],
  ["INP (lab estimate)", "inp", "ms"], ["CLS", "cls", ""], ["Transferred", "kb", "KB"],
  ["…of which JS", "jsKb", "KB"], ["…of which images", "imgKb", "KB"],
];
const fmt = (v, u) => (u === "" ? v.toFixed(3) : `${Math.round(v).toLocaleString("en")} ${u}`);
const change = (a, b) => (a === 0 ? "–" : `${Math.round(((b - a) / a) * 100)}%`);
const md = [
  `| Metric (median of ${RUNS}) | Before | After | Change |`, "|---|---|---|---|",
  ...rows.map(([label, k, u]) => `| ${label} | ${fmt(results.before[k], u)} | ${fmt(results.after[k], u)} | ${change(results.before[k], results.after[k])} |`),
].join("\n");

await mkdir(path.join(root, "bench/results"), { recursive: true });
await writeFile(path.join(root, "bench/results/results.json"), JSON.stringify(results, null, 2));
await writeFile(path.join(root, "bench/results/results.md"),
  `# Lab results\n\nMobile emulation: 412×823, 4× CPU slowdown, Slow 4G (150 ms RTT, 1.6 Mbps).\n${new Date().toISOString().slice(0, 10)}\n\n${md}\n`);
console.log("\n" + md);
