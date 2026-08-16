// BF_WEBSITE_BOREAL_PAGES_v3
import SEO from "@/components/SEO";
import { APPLY_URL } from "@/config/site";
import { trackConversion } from "@/main";
import { buildApplyUrl, getReadinessSessionToken } from "@/utils/session";

const STEPS = [
  { title: "Apply online, about five minutes", paragraphs: ["Business details, what you need the money for, and six months of business bank statements. That's enough to start on most files.", "Larger amounts and some products need more — financial statements, a rent roll, an equipment list, a purchase agreement. We ask for what your file actually needs, when it needs it, rather than sending you a list of everything before we've read anything.", "Applying does not affect your credit. We do not pull it."] },
  { title: "We take your file to the market", paragraphs: ["Our team reads the file properly, works out which lenders on our panel fund businesses like yours, and takes it to them.", "Eighty-plus Canadian lenders sounds like a lot to manage. It isn't, because you don't manage it. You have one point of contact here for the whole process.", "We come back with what you qualify for, what each option costs, and where the trade-offs are. If something looks wrong for you we'll say so."] },
  { title: "Choose your terms and get funded", paragraphs: ["You pick the offer that suits. The lender may run a credit check at this point — after you've signed a term sheet, not before, and with your agreement.", "Most complete applications reach funding in three to four days. Complex files and larger amounts take longer. We tell you which yours is early."] },
] as const;

export default function HowItWorks() {
  const applyHref = buildApplyUrl(APPLY_URL, getReadinessSessionToken());
  return (
    <>
      <SEO title="How Business Financing Works With Boreal | One Application, 80+ Lenders" description="Apply once. We take your file to 80+ Canadian lenders and come back with what you qualify for. Funding in 3-4 days. We never pull your credit." />
      <main className="bg-white font-sans text-boreal-ink">
        <section className="bg-gradient-to-br from-boreal-ink via-boreal-inkDeep to-[#0d233f]"><div className="mx-auto max-w-[820px] px-6 py-16 md:py-24"><h1 className="font-display text-4xl font-bold text-white md:text-5xl">How it works</h1><p className="mt-5 text-lg leading-relaxed text-[#c3cfe0]">Going direct to lenders means telling your story over and over and collecting a rejection from each one. This is the other way round.</p></div></section>
        <section className="mx-auto max-w-[820px] px-6 py-16 md:py-24"><ol className="space-y-10">{STEPS.map((step, index) => <li key={step.title} className="flex gap-6"><div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-boreal-ink font-display text-lg font-bold text-white">{index + 1}</div><div><h2 className="font-display text-2xl font-bold">{step.title}</h2>{step.paragraphs.map((paragraph) => <p key={paragraph} className="mt-3 text-[16px] leading-relaxed text-boreal-body">{paragraph}</p>)}</div></li>)}</ol></section>
        <section className="border-y border-boreal-line bg-boreal-mist"><div className="mx-auto max-w-[820px] px-6 py-14"><h2 className="font-display text-2xl font-bold">What it costs you</h2><p className="mt-3 text-[16px] leading-relaxed text-boreal-body">Nothing to apply, nothing to be matched, nothing to talk to us. The lender that funds you pays our fee, unless we agree something different with you in advance and in writing.</p><a href={applyHref} onClick={() => trackConversion("apply_click", { where: "how_it_works" })} className="mt-7 inline-block rounded-lg bg-boreal-gold px-6 py-3.5 text-[15px] font-semibold text-boreal-ink transition hover:bg-[#cfa953]">Apply now — about five minutes</a></div></section>
      </main>
    </>
  );
}
