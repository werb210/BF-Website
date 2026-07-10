// BF_WEBSITE_REFERRAL_LANDING_v1 - splash pages a referred person lands on from
// a referrer invite SMS. Two variants, mounted by the router:
//   /r/f/:code  -> "funding"  (commercial funding only)
//   /r/b/:code  -> "both"     (funding + Personal Guarantee coverage)
// The ref code rides in the path and is appended to the "Apply now" links so
// attribution flows into the application (client.boreal.financial for funding;
// www.boreal.insure/applications/new for PGI). "Learn more" links to the
// relevant marketing site.
import { APPLY_URL } from "@/config/site";

const BF_SITE = "https://www.boreal.financial/";
const BI_SITE = "https://www.boreal.insure/";
const BI_APPLY = "https://www.boreal.insure/applications/new";

function withRef(base: string, code: string): string {
  const c = encodeURIComponent(code);
  return base.includes("?") ? `${base}&ref=${c}` : `${base}?ref=${c}`;
}

type Btn = { label: string; href: string; primary?: boolean; external?: boolean };

function Actions({ buttons }: { buttons: Btn[] }) {
  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      {buttons.map((b) => (
        <a
          key={b.label + b.href}
          href={b.href}
          target={b.external ? "_blank" : undefined}
          rel={b.external ? "noopener noreferrer" : undefined}
          className={
            b.primary
              ? "inline-flex items-center justify-center rounded-full bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
              : "inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-3 font-semibold text-white transition hover:bg-white/10"
          }
        >
          {b.label}
        </a>
      ))}
    </div>
  );
}

function FundingCard({ code, framed }: { code: string; framed?: boolean }) {
  const apply = withRef(APPLY_URL, code);
  return (
    <div className={framed ? "rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8" : ""}>
      <h2 className="text-2xl font-semibold">Business funding</h2>
      <p className="mt-3 text-white/70">
        Boreal Financial matches Canadian businesses with the right capital -
        commercial term loans, lines of credit, equipment and leasing - across
        40+ lenders, with a single application.
      </p>
      <Actions
        buttons={[
          { label: "Apply now", href: apply, primary: true, external: true },
          { label: "Learn more", href: BF_SITE, external: true },
        ]}
      />
    </div>
  );
}

function PgiCard({ code }: { code: string }) {
  const apply = withRef(BI_APPLY, code);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
      <h2 className="text-2xl font-semibold">Personal Guarantee coverage</h2>
      <p className="mt-3 text-white/70">
        Boreal Risk Management helps Canadian business owners protect the
        personal guarantees behind their financing - so a business setback does
        not have to become a personal one.
      </p>
      <Actions
        buttons={[
          { label: "Apply now", href: apply, primary: true, external: true },
          { label: "Learn more", href: BI_SITE, external: true },
        ]}
      />
    </div>
  );
}

export default function ReferralLanding({
  code,
  variant,
}: {
  code?: string;
  variant: "funding" | "both";
}) {
  const refCode = (code || "").trim();

  if (!refCode) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">This referral link is no longer valid</h1>
        <p className="mt-3 text-white/60">
          Please ask your referrer to send you a fresh link, or head to{" "}
          <a href={BF_SITE} className="underline">boreal.financial</a>.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
        You have been referred to Boreal
      </p>
      {variant === "funding" ? (
        <>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Funding for your business, matched in minutes
          </h1>
          <div className="mt-8">
            <FundingCard code={refCode} />
          </div>
        </>
      ) : (
        <>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Two ways Boreal can help
          </h1>
          <p className="mt-3 text-white/70">
            Someone thought Boreal could help your business - with funding, with
            protecting your personal guarantee, or both. Choose what fits.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <FundingCard code={refCode} framed />
            <PgiCard code={refCode} />
          </div>
        </>
      )}
    </section>
  );
}
