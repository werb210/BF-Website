import { useEffect, useMemo } from "react";
import { CLIENT_APP_URL } from "@/config/site";
import { buildApplyUrl, getReadinessSessionToken } from "@/utils/session";

const PREFILL_STORAGE_KEY = "prefill_data";

type PrefillData = {
  name: string;
  email: string;
  phone: string;
  businessName: string;
};

function getPrefillData(): PrefillData | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(PREFILL_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<PrefillData>;
    if (!parsed.name || !parsed.email || !parsed.phone || !parsed.businessName) {
      return null;
    }

    return {
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      businessName: parsed.businessName,
    };
  } catch {
    return null;
  }
}

export default function Apply() {
  const applyHref = useMemo(() => {
    const url = new URL(buildApplyUrl(CLIENT_APP_URL, getReadinessSessionToken()));
    const params = new URLSearchParams(window.location.search);

    if (params.get("prefill") === "true") {
      const prefillData = getPrefillData();
      if (prefillData) {
        url.searchParams.set("prefill", "true");
        url.searchParams.set("prefill_data", JSON.stringify(prefillData));
      }
    }

    return url.toString();
  }, []);

  useEffect(() => {
    window.location.href = applyHref;
  }, [applyHref]);

  return (
    <section className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-3xl font-bold">Redirecting to Application</h1>
      <p className="mt-3 text-slate-600">
        If you are not redirected, <a href={applyHref} className="underline">click here to continue</a>.
      </p>
    </section>
  );
}
