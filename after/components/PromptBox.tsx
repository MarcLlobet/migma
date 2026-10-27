"use client";

import { useState } from "react";
import { hero } from "@migma-bench/ui/content";

// Client island: only the interactive prompt hydrates.
// Static placeholder instead of a 40 ms typewriter loop.
export function PromptBox() {
  const [value, setValue] = useState("");
  return (
    <form className="prompt" onSubmit={(e) => e.preventDefault()}>
      <label className="sr-only" htmlFor="prompt">Describe your email</label>
      <textarea id="prompt" value={value} placeholder={hero.prompts[0]} onChange={(e) => setValue(e.target.value)} />
      <div className="prompt-row">
        <button type="button" className="icon-btn" aria-label="Attach">+</button>
        <button type="button" className="icon-btn" aria-label="Settings">⚙</button>
        <button type="submit" className="icon-btn send" aria-label="Send" disabled={!value.trim()}>↑</button>
      </div>
    </form>
  );
}
