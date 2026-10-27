"use client";

// Same asset type as production: an animated GIF (~650 KB, 315 frames, 110×98)
// displayed at 31–44 px.
export function GifLogo({ size }: { size: number }) {
  return <img src="/images/MigmaAI.gif" width={size} height={size} alt="Migma" />;
}
