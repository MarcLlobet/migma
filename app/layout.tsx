import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fontUrl, snapshotCss, snapshotMeta } from "../lib/snapshot";

export const metadata: Metadata = {
  title: snapshotMeta.title,
  description: snapshotMeta.description,
  // Point search engines to the original page so this replica doesn't compete with it.
  alternates: { canonical: "https://migma.ai/" },
};

const { lang, class: htmlClass, "data-backdrop": backdrop } = snapshotMeta.htmlAttrs;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={lang} className={htmlClass} data-backdrop={backdrop} style={{ colorScheme: "dark" }}>
      <head>
        <link rel="preload" as="font" type="font/woff2" href={fontUrl} crossOrigin="" />
        {/* migma.ai's CSS, trimmed to the rules this page uses, inlined so it doesn't block rendering */}
        <style dangerouslySetInnerHTML={{ __html: snapshotCss }} />
      </head>
      <body className={snapshotMeta.bodyClass}>{children}</body>
    </html>
  );
}
