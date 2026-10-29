// Post-build: remove Next.js's client runtime from the exported HTML.
//
// The page is fully rendered at build time and nothing on it needs React in the
// browser. Without this step every visit downloads ~134 KB of framework JS and
// ~230 KB of inline RSC data (a second copy of the page), and spends ~280 ms
// hydrating it. Interactions live in public/enhance.js (marked data-keep).
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("out");

async function htmlFiles(dir) {
  const files = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await htmlFiles(p)));
    else if (e.name.endsWith(".html")) files.push(p);
  }
  return files;
}

for (const file of await htmlFiles(outDir)) {
  let html = await readFile(file, "utf8");
  const before = html.length;
  html = html
    .replace(/<script(?![^>]*data-keep)[^>]*>[\s\S]*?<\/script>/g, "")
    .replace(/<link[^>]*rel="(?:modulepreload|preload)"[^>]*as="script"[^>]*>/g, "")
    .replace(/<link[^>]*as="script"[^>]*rel="(?:modulepreload|preload)"[^>]*>/g, "");
  await writeFile(file, html);
  console.log(`${path.relative(outDir, file)}: ${Math.round(before / 1024)} KB → ${Math.round(html.length / 1024)} KB`);
}
