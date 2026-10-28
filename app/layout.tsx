import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./styles.css";
import { gifLogo, imageHero, base } from "../components/variant";

export const metadata: Metadata = {
  title: "Migma homepage: performance prototype",
  description: "Performance prototype of the migma.ai homepage. Not the official site.",
  // Point search engines to the original page so this replica doesn't compete with it.
  alternates: { canonical: "https://migma.ai/" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      {gifLogo && <head><link rel="preload" as="image" href={`${base}/images/MigmaAI.gif`} /></head>}
      <body style={imageHero ? { backgroundImage: `url(${base}/images/bg/noise.png)` } : undefined}>{children}</body>
    </html>
  );
}
