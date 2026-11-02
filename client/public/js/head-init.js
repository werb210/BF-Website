/* BF_WEBSITE_v789_HEAD_INIT
 * Everything index.html used to run as inline <script> blocks, moved into one
 * same-origin file so the Content-Security-Policy in staticwebapp.config.json
 * can forbid inline script. It must stay a classic (non-module) script that
 * runs before the async gtag.js tag below it in <head>.
 *
 * 1. Google Consent Mode v2 defaults. Everything that is not strictly
 *    necessary starts DENIED; the banner's Accept grants it. A visitor who
 *    accepted on an earlier visit is granted here straight away, so the first
 *    page view of a return visit is not lost while React boots.
 *    BF_WEBSITE_v868_QUEBEC_CONSENT - the denied defaults are only kept for
 *    visitors in Quebec (Law 25). Everyone else (the rest of Canada and the
 *    US) is told by the banner and Google is granted on notice until they
 *    press Decline; personalised ads stay off until Accept. Where the visitor
 *    is comes from BF-Server GET /api/privacy/region (1.5 s at most, kept for
 *    the browser session), else the browser's time zone and language.
 * 2. The Google Ads tag config (BF_WEBSITE_ADS_TAG_v152).
 * 3. Non-blocking Google Fonts (replaces the inline onload= handler).
 * 4. Service worker registration (BF_WEBSITE_BLOCK_1_36_PWA_SETUP).
 *
 * Microsoft Clarity is NOT loaded here. It loads only after Accept
 * (client/src/analytics/consent.ts).
 */
(function () {
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  window.gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 1500
  });
  // BF_WEBSITE_v868_QUEBEC_CONSENT - no ad click identifiers while ad_storage is denied.
  window.gtag("set", "ads_data_redaction", true);

  var stored = null;
  try { stored = window.localStorage.getItem("boreal_consent_v1"); } catch (e) { stored = null; }
  if (stored === "granted") {
    window.gtag("consent", "update", {
      ad_storage: "granted",
      analytics_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted"
    });
  }

  // BF_WEBSITE_v868_QUEBEC_CONSENT - Quebec or not. A stored choice (Accept or
  // Decline) always wins; only a visitor who has not answered yet is affected.
  var REGION_KEY = "bf_privacy_region";
  var regionDone = false;
  function applyRegion(region, fromServer) {
    if (regionDone) return;
    regionDone = true;
    window.__bfConsentRegion = region;
    if (fromServer) {
      try { window.sessionStorage.setItem(REGION_KEY, region); } catch (e) { /* ignore */ }
    }
    if (region === "other" && stored !== "granted" && stored !== "denied") {
      window.gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
        ad_user_data: "granted"
      });
    }
    try { window.dispatchEvent(new CustomEvent("bf-consent-region", { detail: region })); } catch (e) { /* ignore */ }
  }
  function fallbackRegion() {
    var tz = "";
    var langs = [];
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) { tz = ""; }
    try { langs = (navigator.languages || []).concat([navigator.language || ""]); } catch (e) { langs = []; }
    var french = false;
    for (var i = 0; i < langs.length; i++) if (String(langs[i]).toLowerCase() === "fr-ca") french = true;
    return (tz === "America/Toronto" || tz === "America/Montreal") && french ? "QC" : "other";
  }
  var savedRegion = null;
  try { savedRegion = window.sessionStorage.getItem(REGION_KEY); } catch (e) { savedRegion = null; }
  if (savedRegion === "QC" || savedRegion === "other") {
    applyRegion(savedRegion, false);
  } else if (typeof window.fetch === "function") {
    var ctrl = typeof AbortController === "function" ? new AbortController() : null;
    var timer = setTimeout(function () {
      if (ctrl) ctrl.abort();
      applyRegion(fallbackRegion(), false);
    }, 1500);
    window.fetch("https://server.boreal.financial/api/privacy/region", { credentials: "omit", signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { return r && r.ok ? r.json() : null; })
      .then(function (body) {
        clearTimeout(timer);
        var region = body && body.region;
        if (region === "QC" || region === "other") applyRegion(region, true);
        else applyRegion(fallbackRegion(), false);
      })
      .catch(function () { clearTimeout(timer); applyRegion(fallbackRegion(), false); });
  } else {
    applyRegion(fallbackRegion(), false);
  }

  window.gtag("js", new Date());
  window.gtag("config", "AW-18248196538", {
    linker: { domains: ["boreal.financial", "client.boreal.financial"], accept_incoming: true }
  });

  var fonts = document.getElementById("bf-fonts");
  if (fonts) {
    var useFonts = function () { fonts.media = "all"; };
    if (fonts.sheet) useFonts();
    else fonts.addEventListener("load", useFonts);
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js").catch(function () {});
    });
  }
})();

