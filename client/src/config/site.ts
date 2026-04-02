export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const clientAppUrl = (import.meta.env.VITE_CLIENT_APP_URL ?? "").replace(/\/$/, "");

export const CLIENT_APP_URL = clientAppUrl || (typeof window !== "undefined" ? window.location.origin : "");
export const APPLY_URL = `${CLIENT_APP_URL}/apply`;
export const SITE_URL = "https://borealfinancial.com";
