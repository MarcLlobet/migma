import { snapshotHtml } from "../lib/snapshot";
import { Enhance } from "../components/Enhance";

// Same markup, CSS and images as migma.ai (captured Oct 29, 2026), served as
// static HTML. The only client JavaScript is <Enhance />: menu and prompt.
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
      <Enhance />
    </>
  );
}
