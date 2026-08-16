import SEO from "@/components/SEO";

const STAFF_PORTAL = "https://staff.boreal.financial";

export default function StaffLogin() {
  return (
    <main className="bg-white font-sans text-boreal-ink">
      <SEO
        title="Staff Login"
        description="Internal portal access for the Boreal Financial team."
        noindex
      />
      <section className="bg-gradient-to-br from-boreal-ink via-boreal-inkDeep to-[#0d233f]">
        <div className="mx-auto max-w-[820px] px-6 py-14 md:py-20">
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">Staff login</h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-[#c3cfe0]">
            Internal access for the Boreal Financial team.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-[820px] px-6 py-16 md:py-24">
        <div className="rounded-xl border border-boreal-line bg-white px-6 py-8">
          <h2 className="font-display text-2xl font-bold">Continue to the staff portal</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-boreal-body">
            You will be asked to verify a code sent to your registered mobile number.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href={STAFF_PORTAL}
              className="rounded-lg bg-boreal-gold px-6 py-3.5 text-center text-[15px] font-semibold text-boreal-ink transition hover:bg-[#cfa953]"
            >
              Continue to login
            </a>
            <a
              href="/"
              className="rounded-lg border border-boreal-line px-6 py-3.5 text-center text-[15px] font-semibold text-boreal-ink transition hover:bg-boreal-mist"
            >
              Back to home
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
