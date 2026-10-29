import { readFileSync } from "node:fs";
import path from "node:path";

// The migma.ai homepage as captured in snapshot/ (see scripts/snapshot/build.mjs).
// Read at build time only: the page is exported as static HTML.
const dir = path.join(process.cwd(), "snapshot");
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const withBase = (s: string) => s.replaceAll("__BASE__", base);

export const snapshotHtml = withBase(readFileSync(path.join(dir, "page.html"), "utf8"));
export const snapshotCss = withBase(readFileSync(path.join(dir, "styles.css"), "utf8"));
export const snapshotMeta = JSON.parse(readFileSync(path.join(dir, "source/meta.json"), "utf8")) as {
  htmlAttrs: Record<string, string>;
  bodyClass: string;
  title: string;
  description: string;
  capturedAt: string;
};
export const fontUrl = `${base}/snap/fonts/MigmaAIDisplayTitle-Bold.woff2`;
