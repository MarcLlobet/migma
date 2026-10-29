// Downloads every asset listed in snapshot/assets.json into public/.
// Runs in GitHub Actions (see .github/workflows/snapshot-assets.yml).
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const assets = JSON.parse(await readFile(path.join(root, "snapshot/assets.json"), "utf8"));
const headers = {
  "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
  accept: "image/webp,image/avif,image/*,*/*;q=0.8",
};

let ok = 0;
const failed = [];
for (const [url, rel] of Object.entries(assets)) {
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const file = path.join(root, "public", rel);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, buf);
    ok++;
    console.log(`✓ ${rel} (${Math.round(buf.length / 1024)} KB, ${res.headers.get("content-type")})`);
  } catch (e) {
    failed.push(`${url}: ${e.message}`);
    console.log(`✗ ${url}: ${e.message}`);
  }
}
console.log(`\n${ok} downloaded, ${failed.length} failed`);
if (failed.length) process.exit(1);
