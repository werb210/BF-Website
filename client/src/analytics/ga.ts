const GA_MEASUREMENT_ID: string | undefined = undefined;

export function initializeGA() {
  if (typeof window === "undefined") return;
  if (!GA_MEASUREMENT_ID) return;

  const existing = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`);
  if (existing) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];

  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }

  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID);
}
