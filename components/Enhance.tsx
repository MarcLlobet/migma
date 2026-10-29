"use client";

import { useEffect } from "react";

// The snapshot is static HTML. This adds back the few interactions that matter,
// without hydrating the page: the navigation menu and the prompt's Send action.
// Everything links to the real migma.ai.
const ORIGIN = "https://migma.ai";
const GROUPS: [string, [string, string][]][] = [
  ["Solutions", [["Marketers", "/marketers"], ["Designers", "/designers"], ["Developers", "/developers"], ["Enterprise", "/enterprise"]]],
  ["Resources", [["Countdowns", "/email-countdown-timer"], ["Email gallery", "/trending"], ["Docs", "https://docs.migma.ai/get-started/introduction"], ["Blog", "/blog"]]],
  ["Migma", [["Pricing", "/pricing"], ["Sign in", "/login"], ["Get started", "/register"]]],
];

function buildPanel() {
  const panel = document.createElement("nav");
  panel.setAttribute("aria-label", "Menu");
  panel.hidden = true;
  Object.assign(panel.style, {
    position: "fixed", top: "64px", left: "12px", right: "12px", zIndex: "60", maxWidth: "420px", marginLeft: "auto",
    padding: "16px", borderRadius: "20px", background: "#18181b", border: "1px solid #3f3f46",
    boxShadow: "0 20px 60px rgba(0,0,0,.5)", display: "grid", gap: "16px", font: "15px/1.4 system-ui, sans-serif",
  });
  for (const [title, links] of GROUPS) {
    const g = document.createElement("div");
    g.innerHTML = `<p style="margin:0 0 6px;color:#a1a1aa;font-size:12px;text-transform:uppercase;letter-spacing:.06em">${title}</p>`;
    for (const [label, href] of links) {
      const a = document.createElement("a");
      a.href = href.startsWith("http") ? href : ORIGIN + href;
      a.textContent = label;
      Object.assign(a.style, { display: "block", padding: "6px 0", color: "#fafafa", textDecoration: "none" });
      g.append(a);
    }
    panel.append(g);
  }
  document.body.append(panel);
  return panel;
}

export function Enhance() {
  useEffect(() => {
    const panel = buildPanel();
    const triggers = [...document.querySelectorAll<HTMLButtonElement>("header button, nav button, button")].filter((b) =>
      ["Open menu", "Solutions", "Resources", "Agents"].includes(b.textContent?.trim() ?? ""),
    );
    const setOpen = (open: boolean) => {
      panel.hidden = !open;
      triggers.forEach((t) => t.setAttribute("aria-expanded", String(open)));
    };
    const toggle = (e: Event) => { e.stopPropagation(); setOpen(panel.hidden); };
    triggers.forEach((t) => t.addEventListener("click", toggle));
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key !== "Escape") return;
      if (e.type === "click" && panel.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", close);

    // Prompt: Send (button or Enter) continues on migma.ai, like the original.
    const go = () => { window.location.href = `${ORIGIN}/register`; };
    const send = document.querySelector<HTMLButtonElement>('button[aria-label="Send"]');
    const prompt = document.querySelector<HTMLElement>('[aria-label="Email prompt"]');
    send?.removeAttribute("disabled");
    send?.addEventListener("click", go);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); go(); } };
    prompt?.addEventListener("keydown", onKey);

    return () => {
      triggers.forEach((t) => t.removeEventListener("click", toggle));
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", close);
      send?.removeEventListener("click", go);
      prompt?.removeEventListener("keydown", onKey);
      panel.remove();
    };
  }, []);
  return null;
}
