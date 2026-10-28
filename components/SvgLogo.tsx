// 2 KB animated SVG (CSS animation inside the file, respects reduced motion).
// Loaded as an <img> so every instance shares one cached request.
// Plain <img> paths aren't prefixed by Next's basePath, so add it here.
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function SvgLogo({ size }: { size: number }) {
  return <img src={`${base}/migma-logo.svg`} width={size} height={Math.round(size * 0.97)} alt="Migma" />;
}
