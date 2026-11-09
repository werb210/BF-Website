// BF_WEBSITE_STATIC_POLICIES_v1 - server-rendered by scripts/prerender-head.ts so /privacy and /terms carry the full
// policy text in the HTML itself. Carrier and app-store vetting tools (Twilio RCS / toll-free, Apple, Google) often read
// the raw page without running JavaScript; before this they saw only a title and reported the links as unreachable.
import { renderToStaticMarkup } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import Privacy from "@/pages/privacy";
import TermsPage from "@/pages/TermsPage";

export function renderPolicyPage(route: string): string | null {
  const Page = route === "/privacy" ? Privacy : route === "/terms" ? TermsPage : null;
  if (!Page) return null;
  return renderToStaticMarkup(
    <HelmetProvider context={{}}>
      <Page />
    </HelmetProvider>,
  );
}
