"use client";

import { useEffect, useState } from "react";
import { hero } from "@migma-bench/ui/content";

// Typewriter placeholder driven by React state: a re-render every 40 ms,
// which keeps the main thread busy while the user tries to tap.
export function RotatingPrompt() {
  const [value, setValue] = useState("");
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [pos, setPos] = useState(0);

  useEffect(() => {
    const target = hero.prompts[i % hero.prompts.length];
    const id = setTimeout(() => {
      if (pos < target.length) {
        setText(target.slice(0, pos + 1));
        setPos(pos + 1);
      } else {
        setTimeout(() => { setPos(0); setI(i + 1); }, 1800);
      }
    }, 40);
    return () => clearTimeout(id);
  }, [i, pos]);

  return (
    <form className="prompt" onSubmit={(e) => e.preventDefault()}>
      <label className="sr-only" htmlFor="prompt">Describe your email</label>
      <textarea id="prompt" value={value} placeholder={text} onChange={(e) => setValue(e.target.value)} />
      <div className="prompt-row">
        <button type="button" className="icon-btn" aria-label="Attach">+</button>
        <button type="button" className="icon-btn" aria-label="Settings">⚙</button>
        <button type="submit" className="icon-btn send" aria-label="Send">↑</button>
      </div>
    </form>
  );
}
