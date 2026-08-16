// BF_WEBSITE_READINESS_v5
// Results rebuilt to the approved design system and reframed as
// pre-qualification rather than a grade.
// The tiers were re-banded in July because the old cutoffs "graded healthy
// small businesses as Moderate and deterred applications". A big red number
// does the same thing, so the score is secondary here and what to do next is
// primary. No tier tells anyone they cannot apply, because none of them means
// that - the field of lenders narrows, it does not close.
// The ?fresh=1 apply link is preserved: it clears any stale bf_jwt_token so the
// applicant gets OTP and phone prefill rather than being dumped into step 1.
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";

const CREDIT_RESULT_STORAGE_KEY = "boreal.credit-readiness.result";

type StoredResult = {
  score: number;
  tier: "green" | "yellow" | "red";
  capitalRange?: string;
  companyName?: string;
  phone?: string;
  redirect?: string | null;
};

const TIER_COPY: Record<
  StoredResult["tier"],
  { label: string; headline: string; blurb: string; next: string[]; accent: string }
> = {
  green: {
    label: "Well positioned",
    headline: "Most of our panel will want to look at this.",
    blurb:
      "Your trading history and revenue put you inside the credit box for the majority of lenders we work with. That usually means a real choice of offers rather than one take-it-or-leave-it.",
    next: [
      "Have six months of business bank statements ready.",
      "Apply once and we'll bring back what you qualify for.",
      "Most complete files reach funding in three to four days.",
    ],
    accent: "#2f9e5b",
  },
  yellow: {
    label: "Fundable, with the right lender",
    headline: "There's a real path here — it just needs the right match.",
    blurb:
      "Some lenders will decline on the numbers alone. Others weigh revenue, receivables or the asset you're financing more heavily, and fund businesses exactly like yours. Knowing which is which is the whole job.",
    next: [
      "Six months of business bank statements to start.",
      "Financial statements or a receivables ageing report help here.",
      "Apply and we'll tell you honestly which lenders fit and which don't.",
    ],
    accent: "#BF9B49",
  },
  red: {
    label: "Narrower, but not closed",
    headline: "Fewer lenders, and the ones that fit matter more.",
    blurb:
      "The field is smaller at this stage and terms will reflect that. Secured products — equipment financing, factoring against your customers' credit — are often available where an unsecured loan isn't. We'd rather tell you that than let you find out one rejection at a time.",
    next: [
      "Equipment financing and factoring are worth looking at first.",
      "Six months of business bank statements to start.",
      "Applying costs nothing and doesn't touch your credit.",
    ],
    accent: "#b8892b",
  },
};

export default function CreditResults() {
  const [result, setResult] = useState<StoredResult | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(CREDIT_RESULT_STORAGE_KEY);
      if (raw) setResult(JSON.parse(raw));
    } catch {
      setResult(null);
    }
  }, []);

  // ?fresh=1 clears any stale bf_jwt_token and forces an OTP login. Without it,
  // a user who tested earlier on the same browser keeps the prior token and
  // lands in the wizard with no phone prefill.
  const applyHref = useMemo(() => "https://client.boreal.financial/apply?fresh=1", []);

  if (!result) {
    return (
      <main className="bg-white font-sans text-boreal-ink">
        <div className="mx-auto max-w-[820px] px-6 py-20 text-center">
          <h1 className="font-display text-3xl font-bold">Nothing to show yet</h1>
          <p className="mt-4 text-[16px] leading-relaxed text-boreal-body">
            Answer a few questions about your business and we&rsquo;ll tell you what&rsquo;s
            realistic.
          </p>
          <Link
            href="/credit-readiness"
            className="mt-7 inline-block rounded-lg bg-boreal-gold px-6 py-3.5 text-[15px] font-semibold text-boreal-ink transition hover:bg-[#cfa953]"
          >
            See what I could qualify for
          </Link>
        </div>
      </main>
    );
  }

  const tier = TIER_COPY[result.tier];

  return (
    <>
      <SEO
        title="Your Financing Options | Boreal Financial"
        description="What your business could qualify for, and what to do next."
        noindex
      />
      <main className="bg-white font-sans text-boreal-ink">
        <section className="bg-gradient-to-br from-boreal-ink via-boreal-inkDeep to-[#0d233f]">
          <div className="mx-auto max-w-[820px] px-6 py-14 md:py-20">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-boreal-gold">
              {result.companyName ? result.companyName : "Your business"}
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white md:text-[44px]">
              {tier.headline}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-[#c3cfe0]">{tier.blurb}</p>
          </div>
        </section>

        <section className="mx-auto max-w-[820px] px-6 py-12 md:py-16">
          <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-boreal-line bg-boreal-mist px-7 py-6">
            <div>
              <div className="font-display text-5xl font-bold" style={{ color: tier.accent }}>
                {result.score}
              </div>
              <div className="text-[13px] text-boreal-body">out of 100</div>
            </div>
            <div className="border-l border-boreal-line pl-6">
              <div className="font-display text-[22px] font-bold" style={{ color: tier.accent }}>
                {tier.label}
              </div>
              {result.capitalRange ? (
                <div className="mt-1 text-[15px] text-boreal-body">
                  Indicative range: {result.capitalRange}
                </div>
              ) : null}
            </div>
          </div>

          <h2 className="mt-12 font-display text-2xl font-bold">What to do next</h2>
          <ul className="mt-5 space-y-3">
            {tier.next.map((n) => (
              <li
                key={n}
                className="flex gap-3 rounded-xl border border-boreal-line bg-white px-6 py-4 text-[16px] leading-relaxed text-boreal-ink"
              >
                <span aria-hidden="true" className="font-semibold text-boreal-gold">
                  &#10003;
                </span>
                {n}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3.5">
            <a
              href={applyHref}
              className="rounded-lg bg-boreal-gold px-6 py-3.5 text-[15px] font-semibold text-boreal-ink transition hover:bg-[#cfa953]"
            >
              Apply now
            </a>
            <Link
              href="/products"
              className="rounded-lg border border-boreal-line px-6 py-3.5 text-[15px] font-semibold text-boreal-ink transition hover:border-boreal-gold"
            >
              See the products
            </Link>
          </div>
          <p className="mt-4 text-sm text-boreal-body">
            This is an indication based on what you told us, not a credit decision. Nothing here
            affects your credit file.
          </p>
        </section>
      </main>
    </>
  );
}
