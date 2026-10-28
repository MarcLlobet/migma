import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./styles.css";

export const metadata: Metadata = {
  title: "Migma homepage: performance prototype",
  description: "Performance prototype of the migma.ai homepage. Not the official site.",
  // Point search engines to the original page so this replica doesn't compete with it.
  alternates: { canonical: "https://migma.ai/" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      {/* Preloaded like on migma.ai */}
      <head><link rel="preload" as="image" href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/MigmaAI.gif`} /></head>
      <body>{children}</body>
    </html>
  );
}
