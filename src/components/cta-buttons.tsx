import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { APPLY_URL } from "@/config/links";
import { trackEvent } from "@/utils/analytics";
import { buildApplyUrl, getReadinessSessionToken } from "@/utils/session";

type CTAProps = {
  children?: ReactNode;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "cta";
  size?: "default" | "sm" | "lg";
};

export function ApplyNowButton({ children, className, variant = "cta", size = "lg" }: CTAProps) {
  const token = getReadinessSessionToken();
  const href = buildApplyUrl(APPLY_URL, token);

  return (
    <Button asChild className={["h-11 px-6 rounded-full", className].filter(Boolean).join(" ")} variant={variant} size={size}>
      <a href={href} onClick={() => trackEvent("apply_clicked", { source: "homepage", readinessSession: token ? "present" : "none" })}>
        {children ?? "Apply Now"}
      </a>
    </Button>
  );
}

export function AskQuestionButton({ children, className, variant = "outline", size = "lg" }: CTAProps) {
  return (
    <Button asChild className={["h-11 px-6 rounded-full", className].filter(Boolean).join(" ")} variant={variant} size={size}>
      <a href="/contact">{children ?? "Speak With Advisor"}</a>
    </Button>
  );
}


export function DualCTAButtons() {
  return (
    <div className="flex items-center gap-4">
      <ApplyNowButton />
      <AskQuestionButton />
    </div>
  );
}
