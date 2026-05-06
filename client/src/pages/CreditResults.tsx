import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";

const CREDIT_RESULT_STORAGE_KEY = "boreal.credit-readiness.result";

type StoredResult = {
  score: number;
  tier: "green" | "yellow" | "red";
  capitalRange?: string;
  companyName?: string;
  phone?: string;
  redirect?: string | null;
};

const TIER_COPY: Record<StoredResult["tier"], { label: string; blurb: string; color: string }> = {
  green: { label: "Strong", blurb: "Your business looks well-positioned. Most lenders in our network are likely to make competitive offers.", color: "#22c55e" },
  yellow: { label: "Moderate", blurb: "There's a real path to capital, but expect more documentation and a narrower set of lenders.", color: "#eab308" },
  red: { label: "Early", blurb: "Funding is possible but the field of available lenders is smaller and rates may be higher.", color: "#ef4444" },
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

  // BF_WEBSITE_BLOCK_v124_READINESS_AND_CONTACT_HANDOFF_v1
  // Q7: Apply Now → plain /apply (OTP login). Server-side, BF-Server
  // matches the readiness_session by phone and prefills steps 1/3/4 in
  // the wizard. Don't pass startAt= or a custom redirect — the wizard
  // resumes from the right step automatically.
  // BF_WEBSITE_BLOCK_v150_APPLY_FRESH_OTP_v1
  // Append ?fresh=1 so BF-client's RequireOTP guard clears any stale
  // bf_jwt_token in localStorage and forces an OTP login. Without this,
  // a user who tested earlier on the same browser keeps the prior token
  // and gets dumped straight into the wizard with no phone-prefill — the
  // exact "credit readiness takes me to step 1, not OTP" symptom Todd
  // saw in live testing.
  const applyHref = useMemo(() => "https://client.boreal.financial/apply?fresh=1", []);

  if (!result) {
    return (
      <main className="bg-[#020817] min-h-screen px-5 py-12 text-white">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-4 text-3xl font-bold">No results yet</h1>
          <p className="mb-6 text-white/80">Submit the credit readiness form to see your readiness score.</p>
          <Link href="/credit-readiness" className="inline-block rounded-full bg-white px-6 py-3 font-semibold text-[#020817]">Take the assessment</Link>
        </div>
      </main>
    );
  }

  const tier = TIER_COPY[result.tier];

  return (
    <main className="bg-[#020817] min-h-screen px-5 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-3 text-3xl font-bold md:text-5xl">Your Capital Readiness</h1>
        {result.companyName && <p className="mb-8 text-white/80">For <span className="font-semibold text-white">{result.companyName}</span></p>}
        <div className="rounded-2xl border border-white/10 bg-[#08132a] p-8">
          <div className="flex items-end gap-6">
            <div>
              <div className="text-xs uppercase tracking-wide text-white/60">Readiness score</div>
              <div className="text-7xl font-bold leading-none" style={{ color: tier.color }}>{result.score}</div>
              <div className="text-sm text-white/60">out of 100</div>
            </div>
            <div className="flex-1 pb-2">
              <div className="text-xs uppercase tracking-wide text-white/60">Tier</div>
              <div className="text-2xl font-bold" style={{ color: tier.color }}>{tier.label}</div>
            </div>
          </div>
          <p className="mt-6 text-white/80">{tier.blurb}</p>
        </div>
        <div className="mt-8 flex flex-col gap-3 md:flex-row">
          <a href={applyHref} className="inline-block rounded-full bg-white px-8 py-4 text-center text-base font-semibold text-[#020817] hover:bg-white/90">Apply Now</a>
          <Link href="/products" className="inline-block rounded-full border border-white/20 px-8 py-4 text-center text-base font-semibold text-white hover:bg-white/10">Browse products</Link>
        </div>
      </div>
    </main>
  );
}
