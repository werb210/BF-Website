import { useEffect } from "react";
import { APPLY_URL } from "@/config/site";
import { estimateCommissionValue, trackEvent, trackConversion, trackLeadProfile } from "@/main";

function loadResult() {
  const params = new URLSearchParams(window.location.search);
  const scoreParam = Number(params.get("score"));
  const tierParam = params.get("tier");

  const score = Number.isFinite(scoreParam) ? Math.max(0, Math.min(100, scoreParam)) : 72;
  const tier = tierParam === "green" || tierParam === "yellow" || tierParam === "red" ? tierParam : "yellow";
  const capitalRange = params.get("capitalRange") ?? "";

  return { score, tier, capitalRange };
}

export default function CreditResults() {
  const { score, tier, capitalRange } = loadResult();

  const isGreen = tier === "green" || score >= 80;
  const isYellow = !isGreen && (tier === "yellow" || score >= 60);

  useEffect(() => {
    if (isGreen) {
      trackLeadProfile({
        strength: "strong",
      });

      trackEvent("funnel_stage", {
        stage: "results_strong",
      });
      return;
    }

    if (isYellow) {
      trackLeadProfile({
        strength: "moderate",
      });

      trackEvent("funnel_stage", {
        stage: "results_moderate",
      });
      return;
    }

    trackLeadProfile({
      strength: "weak",
    });

    trackEvent("funnel_stage", {
      stage: "results_weak",
    });
  }, [isGreen, isYellow]);


  useEffect(() => {
    const estimatedValue = estimateCommissionValue(capitalRange);

    trackEvent("funnel_value_signal", {
      estimated_commission_value: estimatedValue,
    });
  }, [capitalRange]);

  const cardAccentClasses = isGreen
    ? "border border-emerald-400/60 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
    : isYellow
      ? "border border-amber-300/60 shadow-[0_0_28px_rgba(251,191,36,0.16)]"
      : "border border-white/10";

  const scoreBarClasses = isGreen
    ? "bg-emerald-400"
    : isYellow
      ? "bg-amber-400"
      : "bg-rose-400";

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#0b1220] px-6 text-white">
      <div className={`w-full max-w-xl rounded-2xl bg-[#0E1A2B] p-8 text-center ${cardAccentClasses}`}>
        <h2 className="mb-4 text-2xl font-semibold">Credit Readiness Assessment</h2>
        <div className="mb-6 overflow-hidden rounded-full bg-white/10">
          <div className={`h-2 rounded-full transition-all ${scoreBarClasses}`} style={{ width: `${score}%` }} />
        </div>


        {isGreen && (
          <p className="mb-6 text-lg leading-8 text-white/85 md:text-xl md:leading-9">
            Congratulations! You are strongly positioned to apply for capital or equipment. Please proceed to the application form and we will begin the underwriting process and build your application package for funding.
          </p>
        )}

        {isYellow && (
          <p className="mb-6 text-lg leading-8 text-white/85 md:text-xl md:leading-9">
            Congratulations! You are positioned to apply. There may be some areas we need to investigate further and clarify during underwriting, but structured capital options are available.
          </p>
        )}

        {!isGreen && !isYellow && (
          <p className="mb-6 text-lg leading-8 text-white/85 md:text-xl md:leading-9">
            Your profile may require additional strengthening before funding. Connect with an advisor and we will outline practical steps to improve readiness.
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <a
            href={APPLY_URL}
            onClick={() => {
              const estimatedValue = estimateCommissionValue(capitalRange);

              trackConversion("apply_click", {
                source: "website",
                location: "results",
                estimated_commission_value: estimatedValue,
              });
            }}
            className="flex h-11 min-w-[170px] items-center justify-center rounded-full bg-blue-600 px-6 font-medium text-white transition hover:bg-blue-700"
          >
            Apply Now
          </a>

          <a
            href="/contact"
            className="flex h-11 min-w-[170px] items-center justify-center rounded-full border border-white/30 px-6 text-white/80 transition hover:bg-white/10"
          >
            Speak With Advisor
          </a>
        </div>
      </div>
    </div>
  );
}
