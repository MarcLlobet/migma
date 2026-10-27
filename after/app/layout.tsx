import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@migma-bench/ui/styles.css";

export const metadata: Metadata = {
  title: "Migma (after): performance prototype",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
