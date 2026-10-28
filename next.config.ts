import type { NextConfig } from "next";

// GitHub Pages serves the site at /<repo>, e.g. https://marcllobet.github.io/migma/.
// The deploy workflow sets BASE_PATH; locally it's empty.
const basePath = process.env.BASE_PATH ?? "";

const config: NextConfig = {
  output: "export", // static HTML in ./out, no server needed
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  // Inline the CSS into the HTML so it doesn't block first paint.
  experimental: { inlineCss: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath, NEXT_PUBLIC_VARIANT: process.env.VARIANT ?? "" },
};

export default config;
