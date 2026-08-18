// BF_WEBSITE_BOREAL_PAGES_v3
import SEO from "@/components/SEO";
import { APPLY_URL } from "@/config/site";
import { trackConversion } from "@/main";
import { buildApplyUrl, getReadinessSessionToken } from "@/utils/session";

const GROUPS = [
  { heading: "Applying", items: [
    { q: "Who qualifies?", a: "Canadian businesses trading at least six months with around $10,000 a month in revenue. Beyond that it depends on your revenue, your industry and what the money is for." },
    { q: "Do you fund start-ups?", a: "Not in Canada at present. Our panel funds businesses already trading. In the United States some SBA products are available to newer businesses." },
    { q: "How long does applying take?", a: "About five minutes for the form. Gathering six months of bank statements is usually the longer part." },
    { q: "What documents do I need?", a: "To start, six months of business bank statements and basic company details. Depending on the amount and product we may need financial statements, an accounts receivable ageing report, an equipment list, or property documents. We ask for what your file needs rather than everything up front." },
  ] },
  { heading: "Credit", items: [
    { q: "Will applying affect my credit score?", a: "No. We do not pull your credit at any point." },
    { q: "When does anyone check my credit?", a: "A lender may run a check after you've signed a term sheet, with your agreement. Not before." },
    { q: "Can I get financing with bad credit?", a: "Credit is one factor among several. Revenue, time in business, industry and available security all matter, and some products — factoring especially — lean more on your customers than on you. Apply and we'll tell you honestly what's available." },
  ] },
  { heading: "Money and timing", items: [
    { q: "How much can I borrow?", a: "From $10,000 to over $100 million, depending on the product and your business. Most working capital requests land well below the top of that range." },
    { q: "How fast can I get funded?", a: "Most complete applications reach funding in three to four days. SBA takes longer — weeks rather than days." },
    { q: "What are your rates?", a: "They vary by product, amount, term and your business, so any number quoted here would be misleading. You'll see real terms from real lenders once we've reviewed your file." },
    { q: "What does Boreal charge me?", a: "Nothing to apply or be matched. The lender that funds you pays our fee, unless we agree something different with you in advance and in writing." },
  ] },
  { heading: "Working with us", items: [
    { q: "Do I deal with one person?", a: "You have one point of contact through the process. Our team works the file together, so nothing stalls because someone's away." },
    { q: "Do I have to accept an offer?", a: "No. There's no obligation at any stage." },
    { q: "What if you can't help?", a: "We'll tell you, and why, rather than leaving you waiting." },
  ] },
] as const;

export default function FAQ() {
  const applyHref = buildApplyUrl(APPLY_URL, getReadinessSessionToken());
  return <><SEO
      title="Business Financing FAQ | Boreal Financial"
      description="Common questions about applying, qualifying, credit checks, timing and cost."
      schema={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: GROUPS.flatMap((g) =>
          g.items.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        ),
      }}
    /><main className="bg-white font-sans text-boreal-ink">
    <section className="bg-gradient-to-br from-boreal-ink via-boreal-inkDeep to-[#0d233f]"><div className="mx-auto max-w-[820px] px-6 py-14 md:py-20"><h1 className="font-display text-4xl font-bold text-white md:text-5xl">Common questions</h1></div></section>
    <section className="mx-auto max-w-[820px] px-6 py-16 md:py-24">{GROUPS.map((group) => <div key={group.heading} className="mb-12 last:mb-0"><h2 className="font-display text-2xl font-bold">{group.heading}</h2><div className="mt-5 space-y-3">{group.items.map((item) => <details key={item.q} className="rounded-xl border border-boreal-line bg-white px-6 py-5"><summary className="cursor-pointer list-none font-display text-[19px] font-bold marker:hidden">{item.q}</summary><p className="mt-3 text-[15px] leading-relaxed text-boreal-body">{item.a}</p></details>)}</div></div>)}</section>
    <section className="border-t border-boreal-line bg-boreal-mist"><div className="mx-auto max-w-[820px] px-6 py-14 text-center"><h2 className="font-display text-2xl font-bold">Still have a question?</h2><p className="mt-3 text-[16px] leading-relaxed text-boreal-body">Call us on +1 (825) 451-1768, or apply and we&rsquo;ll tell you what you qualify for.</p><a href={applyHref} onClick={() => trackConversion("apply_click", { where: "faq_footer" })} className="mt-7 inline-block rounded-lg bg-boreal-gold px-6 py-3.5 text-[15px] font-semibold text-boreal-ink transition hover:bg-[#cfa953]">Apply now</a></div></section>
  </main></>;
}
