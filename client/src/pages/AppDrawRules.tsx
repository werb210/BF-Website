// BF_WEBSITE_APP_LAUNCH_v1 - official rules for the app launch draw (required in Canada: no purchase necessary,
// skill-testing question, prize value, odds, how to enter; Quebec excluded).
import type { ReactNode } from "react";
import SEO from "@/components/SEO";
import { DRAW_END } from "./GetTheApp";

const SPONSOR = "2630108 Alberta Ltd., operating as Boreal Financial";
const ADDRESS = "450 Sparling Crt SW, Edmonton, Alberta T6X 1G9";
const EMAIL = "info@boreal.financial";
const DRAW_DATE = "January 7, 2027";

const S = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="mt-8 space-y-3 text-[16px] leading-relaxed text-boreal-body">
    <h2 className="font-display text-xl font-bold text-boreal-ink">{title}</h2>
    {children}
  </section>
);

export default function AppDrawRules() {
  return (
    <main className="bg-white font-sans text-boreal-ink">
      <div className="mx-auto max-w-[820px] px-6 py-16">
        <SEO title="Boreal app draw: official rules" description="Official rules for the Boreal Financial app launch draw." url="https://www.boreal.financial/app-draw-rules" />
        <h1 className="font-display text-4xl font-bold text-boreal-ink">Boreal app draw: official rules</h1>
        <p className="mt-4 font-semibold">No purchase necessary. A purchase will not increase your chances of winning.</p>
        <S title="1. Sponsor">
          <p>The draw is run by {SPONSOR}, {ADDRESS} (the &ldquo;Sponsor&rdquo;).</p>
        </S>
        <S title="2. Draw period">
          <p>The draw opens on the day the Boreal Financial app is available in the Apple App Store and Google Play, and closes on {DRAW_END} at 11:59 p.m. Mountain Time (the &ldquo;Draw Period&rdquo;).</p>
        </S>
        <S title="3. Who can enter">
          <p>Open to legal residents of Canada, excluding Quebec, who have reached the age of majority in their province or territory of residence. Employees, officers and directors of the Sponsor, and the people they live with, cannot enter.</p>
        </S>
        <S title="4. How to enter">
          <p><strong>With the app:</strong> download the Boreal Financial app and sign in during the Draw Period. Signing in enters you once.</p>
          <p><strong>Without the app:</strong> email {EMAIL} during the Draw Period with &ldquo;App draw&rdquo; in the subject line and your full name and phone number. This enters you once.</p>
          <p>Limit one entry per person, however you enter. Entries that are incomplete, late or sent by automated means are not valid.</p>
        </S>
        <S title="5. Prizes">
          <p>Two prizes: a $500 Visa gift card (first entry drawn) and a $100 Visa gift card (second entry drawn). Total prize value: $600 (CAD). Prizes are awarded as described and cannot be exchanged for cash or transferred. One prize per person.</p>
        </S>
        <S title="6. The draw and the odds">
          <p>The winners will be selected by random draw from all eligible entries on {DRAW_DATE} at {ADDRESS}. The odds of winning depend on the number of eligible entries received.</p>
        </S>
        <S title="7. Winners">
          <p>Each selected entrant will be contacted by email or phone and must reply within 7 days. Before being declared a winner, the entrant must correctly answer, unaided, a mathematical skill-testing question and sign a declaration and release confirming they meet these rules. If a selected entrant cannot be reached, does not reply in time, answers the question incorrectly or does not meet these rules, another entry may be drawn.</p>
        </S>
        <S title="8. Privacy">
          <p>Information you give to enter is used only to run this draw and contact winners, as described in our <a className="font-semibold text-boreal-goldInk hover:underline" href="/privacy">privacy policy</a>. Entering does not sign you up for marketing.</p>
        </S>
        <S title="9. General">
          <p>The Sponsor may cancel, change or suspend the draw if it cannot run as planned, subject to any required approval. The Sponsor&apos;s decisions about the draw are final. This draw is not sponsored, endorsed or run by Apple, Google or Visa. Questions: {EMAIL}.</p>
        </S>
      </div>
    </main>
  );
}
