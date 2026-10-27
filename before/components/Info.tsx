"use client";

import { useState } from "react";

export function Info({ title, text }: { title: string; text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="info">
      <button type="button" className="info-btn" aria-label={`About ${title}`} aria-expanded={open} onClick={() => setOpen(!open)}>i</button>
      {open && <span className="info-pop" role="tooltip">{text}</span>}
    </span>
  );
}
