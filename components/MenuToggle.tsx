"use client";

import { useState } from "react";
import { nav } from "../content";

export function MenuToggle() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="menu-btn" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? "Close" : "Menu"}
      </button>
      {open && <nav className="menu-panel">{nav.map((n) => <a key={n} href="#">{n}</a>)}</nav>}
    </>
  );
}
