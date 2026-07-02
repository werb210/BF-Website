// BF_WEBSITE_BLOCK_v203_EMAIL_LANDING_IFRAME - hosted "view in browser" page.
// The stored html is a complete standalone document (doctype/html/body with its
// own backgrounds and 600px table frame). Injecting it into the site DOM crushed
// the outer full-width table into a 600px div and let the site's dark theme and
// Tailwind preflight bleed into the email markup. Rendering it in an iframe via
// srcDoc gives it its own document + CSS scope, exactly like an email client.
import { useEffect, useState, type CSSProperties } from "react";

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) || "https://server.boreal.financial";

export default function EmailLanding({ slug }: { slug?: string }) {
  const [html, setHtml] = useState<string>("");
  const [state, setState] = useState<"loading" | "ok" | "notfound" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    if (!slug) { setState("notfound"); return; }
    fetch(`${API_BASE}/api/public/landing/${encodeURIComponent(slug)}`)
      .then(async (r) => {
        if (r.status === 404) { if (!cancelled) setState("notfound"); return; }
        if (!r.ok) { if (!cancelled) setState("error"); return; }
        const data = await r.json();
        if (cancelled) return;
        if (data?.html) {
          setHtml(String(data.html));
          setState("ok");
          if (typeof document !== "undefined") document.title = data.title || "Boreal Financial";
        } else setState("notfound");
      })
      .catch(() => { if (!cancelled) setState("error"); });
    return () => { cancelled = true; };
  }, [slug]);

  const shell: CSSProperties = { minHeight: "100vh", background: "#f4f5f7", display: "flex", justifyContent: "center", alignItems: state === "ok" ? "stretch" : "flex-start", padding: state === "ok" ? 0 : "48px 12px" };
  const msg: CSSProperties = { color: "#6b7280", fontFamily: "Arial, Helvetica, sans-serif", margin: 0 };
  if (state === "loading") return <div style={shell}><p style={msg}>Loading...</p></div>;
  if (state === "notfound") return <div style={shell}><p style={msg}>This page is no longer available.</p></div>;
  if (state === "error") return <div style={shell}><p style={{ ...msg, color: "#b91c1c" }}>Something went wrong. Please try again later.</p></div>;
  return (
    <iframe
      title="Boreal Financial email"
      srcDoc={html}
      style={{ display: "block", width: "100%", height: "100vh", border: 0, background: "#f4f5f7" }}
    />
  );
}
