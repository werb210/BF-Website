const clientAppUrl = (typeof window !== "undefined" ? window.location.origin : "").replace(/\/$/, "");

export const CLIENT_APP_URL = clientAppUrl;
export const APPLY_URL = `${CLIENT_APP_URL}/apply`;
export const SITE_URL = "https://borealfinancial.com";
