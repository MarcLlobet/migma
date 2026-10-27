"use client";

// "Before": mirrors how the live homepage behaves today.
// A single "use client" boundary at the top means every section ships as JS
// and hydrates on load, even the purely static ones.

import { Home } from "@migma-bench/ui/Home";
import { GifLogo } from "./GifLogo";
import { RotatingPrompt } from "./RotatingPrompt";
import { MenuToggle } from "./MenuToggle";
import { Reveal } from "./Reveal";
import { Info } from "./Info";

export default function ClientHome() {
  return (
    <Home
      Logo={GifLogo}
      HeroBackground={<img className="hero-bg-img" src="/images/bg/MigmaMobile.webp" alt="" />}
      Prompt={<RotatingPrompt />}
      MenuButton={<MenuToggle />}
      Reveal={Reveal}
      Info={Info}
      subtitleClassName="fade-in"
    />
  );
}
