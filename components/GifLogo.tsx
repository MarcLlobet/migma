// Same approach as migma.ai: an animated GIF logo (~650 KB, 110×98).
// Testing showed it doesn't change the PageSpeed score here, so it stays as on the live site.
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function GifLogo({ size }: { size: number }) {
  return <img src={`${base}/images/MigmaAI.gif`} width={size} height={Math.round((size * 98) / 110)} alt="Migma" />;
}
