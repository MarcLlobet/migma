import type { NextConfig } from "next";

const config: NextConfig = {
  transpilePackages: ["@migma-bench/ui"],
  images: { unoptimized: true },
};

export default config;
