// BF_WEBSITE_BOREAL_PAGES_v3
import ContactForm from "@/components/ContactForm";
import SEO from "@/components/SEO";
import { APPLY_URL } from "@/config/site";
import { trackConversion } from "@/main";
import { scrollToTop } from "@/utils/scrollToTop";
import { buildApplyUrl, getReadinessSessionToken } from "@/utils/session";
import { useEffect } from "react";

const PHONE_DISPLAY = "+1 (825) 451-1768";
const PHONE_HREF = "tel:+18254511768";
const EMAIL = "info@boreal.financial";

export default function Contact() {
  useEffect(() => scrollToTop(), []);
  const applyHref = buildApplyUrl(APPLY_URL, getReadinessSessionToken());
  return <><SEO title="Contact Boreal Financial | Talk To A Real Person" description="Questions about business financing? Call +1 (825) 451-1768 or send us a message. No cost, no obligation." /><main className="bg-white font-sans text-boreal-ink">
    <section className="bg-gradient-to-br from-boreal-ink via-boreal-inkDeep to-[#0d233f]"><div className="mx-auto max-w-[820px] px-6 py-14 md:py-20"><h1 className="font-display text-4xl font-bold text-white md:text-5xl">Talk to us</h1><p className="mt-5 text-lg leading-relaxed text-[#c3cfe0]">If you&rsquo;d rather ask a question before applying, do. There&rsquo;s no script and no cost, and we&rsquo;d rather tell you early that we can&rsquo;t help than waste your week.</p><div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[15px]"><a href={PHONE_HREF} onClick={() => trackConversion("apply_click", { where: "contact_phone" })} className="font-semibold text-boreal-gold hover:underline">{PHONE_DISPLAY}</a><a href={`mailto:${EMAIL}`} className="font-semibold text-white hover:underline">{EMAIL}</a></div></div></section>
    <section className="mx-auto grid max-w-[1200px] gap-10 px-6 py-16 md:py-24 lg:grid-cols-[1.3fr_0.7fr]"><div><h2 className="font-display text-2xl font-bold">Send us a message</h2><div className="mt-6"><ContactForm /></div><p className="mt-4 text-sm text-boreal-body">We usually reply the same business day.</p></div><aside className="h-fit rounded-2xl border border-boreal-line bg-boreal-mist p-7"><h2 className="font-display text-[22px] font-bold">In a hurry?</h2><p className="mt-3 text-[15px] leading-relaxed text-boreal-body">Applying takes about five minutes and puts your file in front of the right lenders faster than a phone call will. It costs nothing and doesn&rsquo;t touch your credit.</p><a href={applyHref} onClick={() => trackConversion("apply_click", { where: "contact_sidebar" })} className="mt-6 block rounded-lg bg-boreal-ink px-5 py-3.5 text-center text-[15px] font-semibold text-white transition hover:bg-boreal-inkDeep">Apply now</a></aside></section>
  </main></>;
}
