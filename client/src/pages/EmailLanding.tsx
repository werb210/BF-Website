// BF_WEBSITE_BLOCK_v202_EMAIL_LANDING — hosted "view in browser" page for a
// marketing email/SMS. Fetches the rendered HTML from BF-Server by slug.
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

  const shell: CSSProperties = { minHeight: "100vh", background: "#f3f4f6", padding: "24px 12px", display: "flex", justifyContent: "center" };
  const msg: CSSProperties = { color: "#6b7280", fontFamily: "Arial, Helvetica, sans-serif", marginTop: 48 };
  if (state === "loading") return <div style={shell}><p style={msg}>Loading…</p></div>;
  if (state === "notfound") return <div style={shell}><p style={msg}>This page is no longer available.</p></div>;
  if (state === "error") return <div style={shell}><p style={{ ...msg, color: "#b91c1c" }}>Something went wrong. Please try again later.</p></div>;
  return (
    <div style={shell}>
      <div style={{ width: "100%", maxWidth: 600 }} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
