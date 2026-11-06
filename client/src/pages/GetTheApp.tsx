// BF_WEBSITE_APP_LAUNCH_v1 - /app: where the "Get the app" buttons in the launch emails land. Store links and the
// app draw summary; the full rules are at /app-draw-rules.
import SEO from "@/components/SEO";

export const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.boreal.client";
// Fill in once Apple approves the listing (App Store Connect > App Information > Apple ID), e.g.
// "https://apps.apple.com/ca/app/boreal-financial/id1234567890". Empty shows "coming soon".
export const APP_STORE_URL = "";
export const DRAW_END = "December 31, 2026";

const btn = "inline-flex items-center justify-center rounded-xl px-6 py-4 text-[16px] font-bold no-underline";

export default function GetTheApp() {
  return (
    <main className="bg-white font-sans text-boreal-ink">
      <div className="mx-auto max-w-[820px] px-6 py-16">
        <SEO title="Get the Boreal Financial app" description="Track your application, upload documents, message your advisor and sign from your phone." url="https://www.boreal.financial/app" />
        <h1 className="font-display text-4xl font-bold text-boreal-ink">Boreal is now on your phone</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-boreal-body">
          See your application status, photograph and upload documents, message your advisor, book a call and sign
          documents, all from the Boreal Financial app.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          {APP_STORE_URL ? (
            <a data-testid="app-store-link" className={`${btn} bg-boreal-ink text-white`} href={APP_STORE_URL}>Download on the App Store</a>
          ) : (
            <span data-testid="app-store-soon" className={`${btn} border border-slate-300 text-boreal-body`}>App Store: coming soon</span>
          )}
          <a data-testid="google-play-link" className={`${btn} bg-boreal-ink text-white`} href={GOOGLE_PLAY_URL}>Get it on Google Play</a>
        </div>

        <section className="mt-12 rounded-2xl border border-slate-200 p-6">
          <h2 className="font-display text-2xl font-bold text-boreal-ink">Download and sign in for a chance to win</h2>
          <p className="mt-3 text-[16px] leading-relaxed text-boreal-body">
            Sign in to the app by {DRAW_END} to be entered. First name drawn wins a $500 Visa gift card; second name
            drawn wins a $100 Visa gift card.
          </p>
          <p className="mt-3 text-[14px] leading-relaxed text-boreal-body">
            No purchase necessary. You can also enter without the app by emailing{" "}
            <a className="font-semibold text-boreal-goldInk hover:underline" href="mailto:info@boreal.financial?subject=App%20draw">info@boreal.financial</a>{" "}
            with &ldquo;App draw&rdquo; in the subject. Open to residents of Canada (excluding Quebec) who are the age of
            majority. Winners must correctly answer a skill-testing question.{" "}
            <a className="font-semibold text-boreal-goldInk hover:underline" href="/app-draw-rules">Official rules</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
