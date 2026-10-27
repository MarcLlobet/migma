import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@migma-bench/ui/styles.css";
import "./before.css";

export const metadata: Metadata = {
  title: "Migma (before): performance prototype",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Production preloads the 651 KB GIF in <head>, competing with the hero. */}
        <link rel="preload" as="image" href="/images/MigmaAI.gif" />
      </head>
      <body>{children}</body>
    </html>
  );
}
