import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function useUTMCapture() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get("utm_source");

    if (utmSource) {
      trackEvent("utm_captured", {
        utm_source: utmSource,
        utm_medium: params.get("utm_medium") ?? "",
        utm_campaign: params.get("utm_campaign") ?? "",
      });
    }
  }, []);
}
