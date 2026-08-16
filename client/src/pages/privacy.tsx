// BF_WEBSITE_LEGAL_v8
// Restyled to the approved design system. The legal text is unchanged - it is
// reproduced exactly as it was, because legal copy is counsel's to write, not
// ours to rewrite while restyling a page.
import SEO from "@/components/SEO";

export default function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy | Boreal Financial"
        description="Review Boreal Financial's Privacy Policy covering how we collect, use, and protect your information."
      />
      <main className="bg-white font-sans text-boreal-ink">
        <section className="bg-gradient-to-br from-boreal-ink via-boreal-inkDeep to-[#0d233f]">
          <div className="mx-auto max-w-[820px] px-6 py-14 md:py-20">
            <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">
              Privacy Policy
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-[820px] px-6 py-16">
          <p className="text-[16px] leading-relaxed text-boreal-body">
            Boreal Financial respects your privacy and protects all information submitted through
            this website.
          </p>
        </section>
      </main>
    </>
  );
}
