import type { ReactNode } from "react";

// Server Component: content is visible in the HTML immediately.
// The reveal is a CSS scroll-driven animation (no JS); browsers without
// support simply show the section.
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`reveal-css ${className}`}>{children}</section>;
}
