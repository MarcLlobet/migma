import { snapshotHtml } from "../lib/snapshot";

// Same markup, CSS and images as migma.ai (captured Oct 29, 2026), served as
// static HTML. No framework JS runs in the browser (see scripts/strip-next-runtime.mjs);
// the menu and the prompt's Send action come from public/enhance.js.
export default function Page() {
  return (
    <>
      <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: snapshotHtml }} />
      <p
        style={{
          position: "fixed", left: 12, bottom: 12, zIndex: 50, margin: 0,
          padding: "6px 10px", borderRadius: 999, font: "500 12px/1.2 system-ui, sans-serif",
          color: "#fafafa", background: "rgba(24,24,27,.92)", border: "1px solid #3f3f46",
        }}
      >
        Performance prototype of migma.ai · not the official site
      </p>
    </>
  );
}
