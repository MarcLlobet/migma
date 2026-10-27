// Minimal static server with gzip, identical for both variants.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import path from "node:path";

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".svg": "image/svg+xml", ".gif": "image/gif", ".webp": "image/webp", ".png": "image/png",
};
const COMPRESS = new Set([".html", ".js", ".css", ".svg"]);

export function serve(dir, port) {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, "http://x");
    const file = path.join(dir, url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname));
    if (!file.startsWith(dir)) { res.writeHead(403).end(); return; }
    try {
      let body = await readFile(file);
      const ext = path.extname(file);
      const headers = { "content-type": TYPES[ext] ?? "application/octet-stream", "cache-control": "no-store" };
      if (COMPRESS.has(ext) && /gzip/.test(req.headers["accept-encoding"] ?? "")) {
        body = gzipSync(body, { level: 9 });
        headers["content-encoding"] = "gzip";
      }
      res.writeHead(200, headers).end(body);
    } catch {
      res.writeHead(404).end("Not found");
    }
  });
  return new Promise((resolve) => server.listen(port, "127.0.0.1", () => resolve(server)));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [dir, port = "4000"] = process.argv.slice(2);
  await serve(path.resolve(dir), Number(port));
  console.log(`Serving ${dir} on http://127.0.0.1:${port}`);
}
