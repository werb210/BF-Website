import { useEffect, useMemo } from "react";
import { APPLY_URL } from "@/config/site";
import { buildApplyUrl, getReadinessSessionToken } from "@/utils/session";

export default function Apply() {
  const applyHref = useMemo(() => buildApplyUrl(APPLY_URL, getReadinessSessionToken()), []);

  useEffect(() => {
    window.location.href = applyHref;
  }, [applyHref]);

  return (
    <section className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-3xl font-bold">Redirecting to Application</h1>
      {/* BF_WEBSITE_v789_READABILITY - the page sits on #020817; slate-600 was 2.6:1, #cbd5e1 is 13.5:1. */}
      <p className="mt-3 text-[#cbd5e1]">
        If you are not redirected, <a href={applyHref} className="underline">click here to continue</a>.
      </p>
    </section>
  );
}
