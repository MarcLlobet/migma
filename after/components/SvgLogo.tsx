// 2 KB animated SVG (CSS animation inside the file, respects reduced motion).
// Loaded as an <img> so the three instances share one cached request.
export function SvgLogo({ size }: { size: number }) {
  return <img src="/migma-logo.svg" width={size} height={Math.round(size * 0.97)} alt="Migma" />;
}
