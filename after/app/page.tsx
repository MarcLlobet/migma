import { Home } from "@migma-bench/ui/Home";
import { SvgLogo } from "../components/SvgLogo";
import { PromptBox } from "../components/PromptBox";
import { MenuToggle } from "../components/MenuToggle";
import { Reveal } from "../components/Reveal";
import { Info } from "../components/Info";

// "After": the page is a Server Component, prerendered at build time.
// Only PromptBox and MenuToggle are client islands; everything else ships
// as HTML with no JavaScript to download or hydrate.
export const dynamic = "force-static";

export default function Page() {
  return (
    <Home
      Logo={SvgLogo}
      HeroBackground={<div className="hero-bg-css" aria-hidden="true" />}
      Prompt={<PromptBox />}
      MenuButton={<MenuToggle />}
      Reveal={Reveal}
      Info={Info}
    />
  );
}
