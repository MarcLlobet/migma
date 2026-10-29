// The page is static HTML with no framework running in the browser.
// This adds back the interactions that matter: the navigation menu and the
// prompt's Send action. Everything links to the real migma.ai.
(() => {
  const ORIGIN = "https://migma.ai";
  const GROUPS = [
    ["Solutions", [["Marketers", "/marketers"], ["Designers", "/designers"], ["Developers", "/developers"], ["Enterprise", "/enterprise"]]],
    ["Resources", [["Countdowns", "/email-countdown-timer"], ["Email gallery", "/trending"], ["Docs", "https://docs.migma.ai/get-started/introduction"], ["Blog", "/blog"]]],
    ["Migma", [["Pricing", "/pricing"], ["Sign in", "/login"], ["Get started", "/register"]]],
  ];

  // Menu panel (opened by "Open menu" on mobile, Solutions/Resources/Agents on desktop)
  const panel = document.createElement("nav");
  panel.setAttribute("aria-label", "Menu");
  Object.assign(panel.style, {
    position: "fixed", top: "64px", left: "12px", right: "12px", zIndex: "60", maxWidth: "420px", marginLeft: "auto",
    padding: "16px", borderRadius: "20px", background: "#18181b", border: "1px solid #3f3f46",
    boxShadow: "0 20px 60px rgba(0,0,0,.5)", display: "none", gap: "16px", font: "15px/1.4 system-ui, sans-serif",
  });
  for (const [title, links] of GROUPS) {
    const group = document.createElement("div");
    const label = document.createElement("p");
    label.textContent = title;
    Object.assign(label.style, { margin: "0 0 6px", color: "#a1a1aa", fontSize: "12px", textTransform: "uppercase", letterSpacing: ".06em" });
    group.append(label);
    for (const [text, href] of links) {
      const a = document.createElement("a");
      a.href = href.startsWith("http") ? href : ORIGIN + href;
      a.textContent = text;
      Object.assign(a.style, { display: "block", padding: "6px 0", color: "#fafafa", textDecoration: "none" });
      group.append(a);
    }
    panel.append(group);
  }
  document.body.append(panel);

  const triggers = [...document.querySelectorAll("button")].filter((b) =>
    ["Open menu", "Solutions", "Resources", "Agents"].includes(b.textContent.trim()),
  );
  let open = false;
  const setOpen = (value) => {
    open = value;
    panel.style.display = open ? "grid" : "none";
    triggers.forEach((t) => t.setAttribute("aria-expanded", String(open)));
  };
  triggers.forEach((t) => t.addEventListener("click", (e) => { e.stopPropagation(); setOpen(!open); }));
  document.addEventListener("click", (e) => { if (open && !panel.contains(e.target)) setOpen(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });

  // Prompt: Send (button or Enter) continues on migma.ai, like the original.
  const go = () => { window.location.href = `${ORIGIN}/register`; };
  const send = document.querySelector('button[aria-label="Send"]');
  const prompt = document.querySelector('[aria-label="Email prompt"]');
  if (send) { send.removeAttribute("disabled"); send.addEventListener("click", go); }
  if (prompt) prompt.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); go(); } });
})();
