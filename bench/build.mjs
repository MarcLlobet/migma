// Lab build: emulates what each Next.js app ships, without needing `next build`.
//   before → prerendered HTML + one bundle that hydrates the whole page
//   after  → prerendered HTML + a bundle that hydrates only the client islands
// Both use the same React version, CSS, copy and content, so the only
// differences are the ones the "after" app makes on purpose.
// Caveat: real Next adds its router runtime to both, and inlines an RSC
// payload in the HTML (bigger for "after"). See README.

import { build } from "esbuild";
import { mkdir, readFile, writeFile, cp, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "bench", "dist");
const tmp = path.join(dist, ".tmp");

const common = {
  bundle: true,
  jsx: "automatic",
  logLevel: "error",
  define: { "process.env.NODE_ENV": '"production"' },
  alias: { "@migma-bench/ui": path.join(root, "packages/ui") },
  resolveExtensions: [".tsx", ".ts", ".js", ".mjs"],
};

// In "after", wrap client islands in a marker so the browser bundle can hydrate
// each one on its own (what Next does for "use client" components).
const ISLANDS = ["PromptBox", "MenuToggle"];
const islandPlugin = {
  name: "islands",
  setup(b) {
    b.onResolve({ filter: /components\/(PromptBox|MenuToggle)$/ }, (args) =>
      args.importer.includes(`${path.sep}after${path.sep}app`) ? { path: args.path.split("/").pop(), namespace: "island" } : undefined);
    b.onLoad({ filter: /.*/, namespace: "island" }, ({ path: name }) => ({
      resolveDir: path.join(root, "after/components"),
      loader: "tsx",
      contents: `import { ${name} as C } from "./${name}";
        export function ${name}(p) { return <div data-island="${name}" style={{ display: "contents" }}><C {...p} /></div>; }`,
    }));
  },
};

async function ssr(entryCode, name, plugins = []) {
  const out = path.join(tmp, `${name}-ssr.mjs`);
  await build({
    ...common, plugins, platform: "node", format: "esm", outfile: out,
    stdin: { contents: entryCode, resolveDir: root, loader: "tsx" },
    loader: { ".css": "empty" },
    external: ["react", "react-dom", "react/*", "react-dom/*"],
  });
  return (await import(pathToFileURL(out).href + `?t=${Date.now()}`)).default;
}

async function client(entryCode, outfile) {
  await build({
    ...common, platform: "browser", format: "esm", minify: true, target: "es2020", outfile,
    stdin: { contents: entryCode, resolveDir: root, loader: "tsx" },
    loader: { ".css": "empty" },
  });
}

function page({ title, body, css, head = "", script }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>${title}</title>
${head}<link rel="stylesheet" href="/styles.css">${css}
<script type="module" src="/${script}" async></script></head>
<body>${body}</body></html>`;
}

await rm(dist, { recursive: true, force: true });
await mkdir(tmp, { recursive: true });
const sharedCss = await readFile(path.join(root, "packages/ui/styles.css"), "utf8");

// ---------- before ----------
{
  const out = path.join(dist, "before");
  await cp(path.join(root, "before/public"), out, { recursive: true });
  const render = await ssr(`
    import { renderToString } from "react-dom/server";
    import ClientHome from "./before/components/ClientHome";
    export default () => renderToString(<ClientHome />);`, "before");
  await client(`
    import { hydrateRoot } from "react-dom/client";
    import ClientHome from "./before/components/ClientHome";
    hydrateRoot(document.getElementById("root"), <ClientHome />);`, path.join(out, "app.js"));
  await writeFile(path.join(out, "styles.css"), sharedCss);
  await cp(path.join(root, "before/app/before.css"), path.join(out, "before.css"));
  await writeFile(path.join(out, "index.html"), page({
    title: "Migma (before)",
    head: `<link rel="preload" as="image" href="/images/MigmaAI.gif">`,
    css: `<link rel="stylesheet" href="/before.css">`,
    body: `<div id="root">${render()}</div>`,
    script: "app.js",
  }));
}

// ---------- after ----------
{
  const out = path.join(dist, "after");
  await cp(path.join(root, "after/public"), out, { recursive: true });
  const render = await ssr(`
    import { renderToString } from "react-dom/server";
    import Page from "./after/app/page";
    export default () => renderToString(<Page />);`, "after", [islandPlugin]);
  await client(`
    import { hydrateRoot } from "react-dom/client";
    ${ISLANDS.map((n) => `import { ${n} } from "./after/components/${n}";`).join("\n")}
    const islands = { ${ISLANDS.join(", ")} };
    for (const el of document.querySelectorAll("[data-island]")) {
      const C = islands[el.dataset.island];
      hydrateRoot(el, <C />);
    }`, path.join(out, "app.js"));
  await writeFile(path.join(out, "styles.css"), sharedCss);
  await writeFile(path.join(out, "index.html"), page({
    title: "Migma (after)",
    css: "",
    body: render(),
    script: "app.js",
  }));
}

await rm(tmp, { recursive: true, force: true });
console.log("Built bench/dist/before and bench/dist/after");
