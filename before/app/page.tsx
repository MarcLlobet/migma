import ClientHome from "../components/ClientHome";

// Prerendered at build time (like production), but the whole tree below is a
// client component, so the browser downloads and hydrates all of it.
export const dynamic = "force-static";

export default function Page() {
  return <ClientHome />;
}
