"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// JS scroll reveal (the pattern animation libraries use): sections start
// invisible in the server HTML and only appear after hydration + an
// IntersectionObserver callback + a React state update.
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: "opacity .6s, transform .6s" }}
    >
      {children}
    </section>
  );
}
