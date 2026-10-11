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
    wait_for_update: 500
  });

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
