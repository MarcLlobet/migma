// Email tests: run on every .html file in a folder.
//   1. Client support with caniemail     (https://www.npmjs.com/package/caniemail)
//   2. Client support with doiuse-email  (https://www.npmjs.com/package/doiuse-email)
//   3. Gmail clipping (HTML over ~102 KB gets cut with "[Message clipped]")
//   4. Accessibility basics (lang, title, alt text, layout tables)
// Every client in the Can I Email database is tested (config.clients),
// but only config.failClients can fail the run; the rest are warnings.
// Usage: node check.mjs <folder>   — settings in config.json
// In GitHub Actions it also writes a job summary (incl. a per-client table) and annotations.

import { readFile, readdir, appendFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { caniemail, formatIssue } from "caniemail";
import { doIUseEmail } from "doiuse-email";
import { parse } from "node-html-parser";

const here = path.dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(await readFile(path.join(here, "config.json"), "utf8"));
const dir = path.resolve(process.argv[2] ?? path.join(here, "..", "emails"));
const LIMIT = 15; // lines shown per check in the summary

// ---------- helpers ----------
async function findHtml(folder) {
  const out = [];
  for (const e of await readdir(folder, { withFileTypes: true })) {
    const p = path.join(folder, e.name);
    if (e.isDirectory()) out.push(...(await findHtml(p)));
    else if (/\.html?$/i.test(e.name)) out.push(p);
  }
  return out.sort();
}

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const globRe = (g) => new RegExp(`^${g.split("*").map(escapeRe).join(".*")}$`);
const failRes = (config.failClients ?? config.clients).map(globRe);
const isMajor = (client) => failRes.some((r) => r.test(client));

// Full client list from the Can I Email data (for the per-client table).
// Falls back to "clients that had issues" if the download fails.
async function allClients() {
  try {
    const res = await fetch("https://www.caniemail.com/api/data.json");
    const data = await res.json();
    const set = new Set();
    for (const f of data.data ?? []) {
      for (const [family, platforms] of Object.entries(f.stats ?? {})) {
        for (const platform of Object.keys(platforms ?? {})) set.add(`${family}.${platform}`);
      }
    }
    const wanted = config.clients.map(globRe);
    return [...set].filter((c) => wanted.some((r) => r.test(c))).sort();
  } catch {
    return [];
  }
}

// caniemail's result type isn't documented in detail, so read it defensively:
// accept Maps, arrays or plain objects keyed by client.
function entries(x) {
  if (!x) return [];
  if (x instanceof Map) return [...x.entries()];
  if (Array.isArray(x)) return x.map((i) => [i?.client ?? "client", i]);
  if (typeof x === "object") return Object.entries(x);
  return [];
}

// Returns { lines: {error, warning}, perClient: Map<client, "fail"|"warn"> }
function caniemailIssues(html, perClient) {
  const result = caniemail({ clients: config.clients, html });
  const found = { error: new Map(), warning: new Map() };
  for (const type of ["error", "warning"]) {
    const bucket = result.issues?.[`${type}s`] ?? result.issues?.[type];
    for (const [rawClient, list] of entries(bucket)) {
      const client = String(rawClient);
      for (const issue of [].concat(list)) {
        let message;
        try { message = formatIssue({ client: rawClient, issue, issueType: type }).message; }
        catch { message = issue?.title ?? JSON.stringify(issue).slice(0, 160); }
        const key = message
          .replace(new RegExp(escapeRe(client), "g"), "")
          .replace(/\s*(?:by|for|on|in)\s*``\.?/g, "")
          .trim();
        // Fails only for unsupported features in major clients, unless the feature
        // is one clients strip harmlessly (config.warnOnly).
        const harmless = config.warnOnly?.some((f) => key.includes(f));
        const fails = type === "error" && isMajor(client) && !harmless;
        const t = fails ? "error" : "warning";
        const label = type === "error" ? key : `${key}`;
        if (!found[t].has(label)) found[t].set(label, new Set());
        found[t].get(label).add(client);
        const status = type === "error" && !harmless ? "fail" : "warn";
        if (perClient.get(client) !== "fail") perClient.set(client, status);
      }
    }
  }
  const lines = (m) => [...m].map(([msg, clients]) => `${msg} (${[...clients].join(", ")})`);
  return { errors: lines(found.error), warnings: lines(found.warning) };
}

function doiuseIssues(html) {
  const result = doIUseEmail(html, { emailClients: config.clients });
  return { success: result.success, notes: [...new Set(result.notes ?? [])] };
}

function accessibility(html) {
  const doc = parse(html);
  const errors = [];
  const warnings = [];
  if (!doc.querySelector("html")?.getAttribute("lang")) errors.push('`<html>` has no `lang` attribute (screen readers may use the wrong language).');
  if (!doc.querySelector("title")?.text.trim()) warnings.push("No `<title>` (shown in some clients and read by screen readers).");
  const imgs = doc.querySelectorAll("img").filter((i) => !i.hasAttribute("alt"));
  if (imgs.length) errors.push(`${imgs.length} image(s) without \`alt\` (use \`alt=""\` for decorative images).`);
  const tables = doc.querySelectorAll("table").filter((t) => !/^(presentation|none)$/.test(t.getAttribute("role") ?? ""));
  if (tables.length) warnings.push(`${tables.length} table(s) without \`role="presentation"\` (layout tables are read as data tables).`);
  return { errors, warnings };
}

// ---------- run ----------
const files = await findHtml(dir).catch(() => []);
if (!files.length) {
  console.log(`No .html emails found in ${dir}. Add exported emails there.`);
  process.exit(0);
}

const report = [];
let failed = false;

for (const file of files) {
  const rel = path.relative(process.cwd(), file);
  const html = await readFile(file, "utf8");
  const bytes = Buffer.byteLength(html);
  const checks = [];
  const perClient = new Map();

  // Size / Gmail clipping
  const sizeFail = bytes > config.gmailClipBytes;
  const sizeWarn = !sizeFail && bytes > config.warnAtBytes;
  checks.push({
    name: "Gmail clipping",
    status: sizeFail ? (config.failOn.size ? "fail" : "warn") : sizeWarn ? "warn" : "pass",
    lines: [`HTML is ${kb(bytes)} (Gmail clips above ${kb(config.gmailClipBytes)}).`],
  });

  // caniemail
  try {
    const r = caniemailIssues(html, perClient);
    checks.push({
      name: "caniemail",
      status: r.errors.length ? (config.failOn.caniemail ? "fail" : "warn") : r.warnings.length ? "warn" : "pass",
      lines: [...r.errors.map((l) => `Not supported: ${l}`), ...r.warnings.map((l) => `Warning: ${l}`)],
    });
  } catch (e) {
    checks.push({ name: "caniemail", status: "fail", lines: [`Checker crashed: ${e.message}`] });
  }

  // doiuse-email
  try {
    const r = doiuseIssues(html);
    checks.push({
      name: "doiuse-email",
      status: r.success ? "pass" : config.failOn.doiuse ? "fail" : "warn",
      lines: r.notes,
    });
  } catch (e) {
    checks.push({ name: "doiuse-email", status: "fail", lines: [`Checker crashed: ${e.message}`] });
  }

  // Accessibility
  const a = accessibility(html);
  checks.push({
    name: "Accessibility",
    status: a.errors.length ? (config.failOn.accessibility ? "fail" : "warn") : a.warnings.length ? "warn" : "pass",
    lines: [...a.errors, ...a.warnings],
  });

  if (checks.some((c) => c.status === "fail")) failed = true;
  report.push({ rel, bytes, checks, perClient });
}

// ---------- output ----------
const icon = { pass: "✅", warn: "⚠️", fail: "❌" };

for (const { rel, checks } of report) {
  console.log(`\n${rel}`);
  for (const c of checks) {
    console.log(`  ${icon[c.status]} ${c.name}`);
    for (const l of c.lines.slice(0, LIMIT)) console.log(`     - ${l}`);
    if (c.lines.length > LIMIT) console.log(`     … ${c.lines.length - LIMIT} more`);
    if (process.env.GITHUB_ACTIONS && c.status !== "pass") {
      const level = c.status === "fail" ? "error" : "warning";
      console.log(`::${level} file=${rel},title=${c.name}::${c.lines.slice(0, 3).join(" | ").replace(/\n/g, " ")}`);
    }
  }
}

if (process.env.GITHUB_STEP_SUMMARY) {
  const names = report[0].checks.map((c) => c.name);
  let md = `## Email checks\n\nTesting all clients in \`${config.clients.join("`, `")}\`. Only \`${(config.failClients ?? config.clients).join("`, `")}\` can fail the run.\n\n`;
  md += `| Email | Size | ${names.join(" | ")} |\n|---|---|${names.map(() => "---").join("|")}|\n`;
  for (const { rel, bytes, checks } of report) {
    md += `| \`${path.basename(rel)}\` | ${kb(bytes)} | ${checks.map((c) => icon[c.status]).join(" | ")} |\n`;
  }

  // Per-client table (caniemail): ✅ no issues, ⚠️ partial support, ❌ something not supported.
  const listed = await allClients();
  const seen = new Set(report.flatMap((r) => [...r.perClient.keys()]));
  const clients = [...new Set([...listed, ...seen])].sort();
  if (clients.length) {
    md += `\n### By client\n\n✅ no issues · ⚠️ partial support · ❌ something not supported · **bold** = can fail the run\n\n`;
    md += `| Client | ${report.map((r) => `\`${path.basename(r.rel)}\``).join(" | ")} |\n|---|${report.map(() => "---").join("|")}|\n`;
    for (const c of clients) {
      const name = isMajor(c) ? `**${c}**` : c;
      md += `| ${name} | ${report.map((r) => icon[r.perClient.get(c) ?? "pass"]).join(" | ")} |\n`;
    }
  }

  for (const { rel, checks } of report) {
    const bad = checks.filter((c) => c.status !== "pass");
    if (!bad.length) continue;
    md += `\n<details><summary><code>${path.basename(rel)}</code> details</summary>\n\n`;
    for (const c of bad) {
      md += `**${icon[c.status]} ${c.name}**\n\n`;
      for (const l of c.lines.slice(0, LIMIT)) md += `- ${l}\n`;
      if (c.lines.length > LIMIT) md += `- … ${c.lines.length - LIMIT} more\n`;
      md += "\n";
    }
    md += "</details>\n";
  }
  await appendFile(process.env.GITHUB_STEP_SUMMARY, md);
}

console.log(failed ? "\nSome emails failed." : "\nAll emails passed.");
process.exit(failed ? 1 : 0);
