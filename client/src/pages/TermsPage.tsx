// BF_WEBSITE_LEGAL_v8
// Restyled to the approved design system. Every clause is reproduced verbatim.
// BF_WEBSITE_v806_TFV - the placeholder note (replace with counsel's text) is gone: carriers reviewing our
// toll-free number read this page, and a placeholder made the Terms look unfinished. Counsel's text still
// replaces these clauses when it arrives.
import SEO from "@/components/SEO";

const CLAUSES: { heading: string; body: React.ReactNode }[] = [
  {
    heading: "1. Service description",
    body: "Boreal Financial is a trade name of 2630108 Alberta Ltd., a commercial financing broker. You apply with us, we prepare your file and submit it on your behalf to the lenders suited to it, and we work with you on the application until it is funded or closed. We do not sell or pass on your information as a lead, and we do not ourselves underwrite, fund, or originate loans. All credit decisions are made by the lender to whom your application is submitted.",
  },
  {
    heading: "2. Eligibility",
    body: "You must be at least 18 years of age and authorized to submit a credit application on behalf of the business you represent.",
  },
  {
    heading: "3. Information accuracy",
    body: "You agree that all information you submit is accurate, current, and complete to the best of your knowledge. You authorize Boreal Financial, and the lenders you ask us to present your application to, to verify any information submitted, including through credit bureau lookups where applicable and consented to.",
  },
  {
    heading: "4. Privacy",
    body: (
      <>
        Use of the service is also governed by our{" "}
        <a href="/privacy" className="font-semibold text-boreal-goldInk hover:underline">
          Privacy Policy
        </a>
        .
      </>
    ),
  },
  // BF_WEBSITE_SMS_POLICY_v160
  {
    heading: "5. Text messages (SMS)",
    // BF_WEBSITE_v806_TFV - named program, carrier wording for STOP/HELP, and the required no-sharing statements.
    body: "Program: Boreal Financial Application Updates. By entering your mobile number on our application you agree to receive texts from Boreal Financial about your application: sign-in codes, status updates, document requests and signing reminders. Up to 10 messages per month. Message and data rates may apply. Reply STOP to opt out, HELP for help. Support: info@boreal.financial or (866) 631-8939. Carriers are not liable for delayed or undelivered messages. No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging opt-in data and consent will not be shared with any third parties.",
  },
  {
    heading: "6. Contact",
    body: (
      <>
        Questions about these terms:{" "}
        <a
          href="mailto:info@boreal.financial"
          className="font-semibold text-boreal-goldInk hover:underline"
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
              Last updated: October 7, 2026{/* BF_WEBSITE_LEGAL_NAME_v179 - a fixed date; it showed today's date on every visit */}
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

        </section>
      </main>
    </>
  );
}
