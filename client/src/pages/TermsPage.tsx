// BF_WEBSITE_LEGAL_v8
// Restyled to the approved design system. Every clause is reproduced verbatim,
// including the placeholder note - legal copy is counsel's to write, and the
// note is there to stop the placeholder shipping unnoticed.
import SEO from "@/components/SEO";

const CLAUSES: { heading: string; body: React.ReactNode }[] = [
  {
    heading: "1. Service description",
    body: "Boreal Financial operates a lending marketplace that introduces business borrowers to a network of independent lenders. We do not ourselves underwrite, fund, or originate loans. All credit decisions are made by the lender to whom your application is submitted.",
  },
  {
    heading: "2. Eligibility",
    body: "You must be at least 18 years of age and authorized to submit a credit application on behalf of the business you represent.",
  },
  {
    heading: "3. Information accuracy",
    body: "You agree that all information you submit is accurate, current, and complete to the best of your knowledge. You authorize Boreal Financial and its lender network to verify any information submitted, including through credit bureau lookups where applicable and consented to.",
  },
  {
    heading: "4. Privacy",
    body: (
      <>
        Use of the service is also governed by our{" "}
        <a href="/privacy" className="font-semibold text-boreal-goldDeep hover:underline">
          Privacy Policy
        </a>
        .
      </>
    ),
  },
  {
    heading: "5. Contact",
    body: (
      <>
        Questions about these terms:{" "}
        <a
          href="mailto:info@boreal.financial"
          className="font-semibold text-boreal-goldDeep hover:underline"
        >
          info@boreal.financial
        </a>
        .
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <SEO
        title="Terms of Service | Boreal Financial"
        description="The terms governing use of the Boreal Financial website and application services."
      />
      <main className="bg-white font-sans text-boreal-ink">
        <section className="bg-gradient-to-br from-boreal-ink via-boreal-inkDeep to-[#0d233f]">
          <div className="mx-auto max-w-[820px] px-6 py-14 md:py-20">
            <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">
              Terms of Service
            </h1>
            <p className="mt-4 text-sm text-boreal-muted">
              Last updated: {new Date().toISOString().slice(0, 10)}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[820px] px-6 py-16">
          <p className="text-[16px] leading-relaxed text-boreal-body">
            Welcome to Boreal Financial. By accessing or using this website and our application
            services, you agree to be bound by these Terms of Service. If you do not agree, please
            do not use the service.
          </p>

          {CLAUSES.map((c) => (
            <div key={c.heading} className="mt-10">
              <h2 className="font-display text-xl font-bold">{c.heading}</h2>
              <p className="mt-3 text-[16px] leading-relaxed text-boreal-body">{c.body}</p>
            </div>
          ))}

          <p className="mt-12 rounded-xl border border-boreal-line bg-boreal-mist px-6 py-4 text-[13px] leading-relaxed text-boreal-body">
            [Placeholder &mdash; replace this Terms body with the full text supplied by counsel
            before public launch.]
          </p>
        </section>
      </main>
    </>
  );
}
