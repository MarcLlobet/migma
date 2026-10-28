// TEMPORARY experiment switches: rebuild the page with one of migma.ai's
// original choices put back, to see which optimizations PageSpeed actually rewards.
// NEXT_PUBLIC_VARIANT: "" | "logo" | "hero" | "logo-hero"
const v = process.env.NEXT_PUBLIC_VARIANT ?? "";
export const gifLogo = v.includes("logo");
export const imageHero = v.includes("hero");
export const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
