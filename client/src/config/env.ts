// BF_WEBSITE_ENV_SINGLE_SOURCE_v1
// BF_WEBSITE_v789_ONE_API_BASE - the single source of truth for the BF-Server
// origin. Every server call (forms, Maya, booking, email landing pages, journey
// tracking) builds its URL from here. VITE_API_BASE_URL overrides the default;
// a trailing slash, /api or /v1 on the override is stripped so apiUrl() always
// produces https://server.boreal.financial/api/<path>.
//
// import.meta.env is read defensively so the module also loads under the node
// test runner, where Vite has not defined it.
const env: Partial<ImportMetaEnv> = import.meta.env ?? {};

export const DEFAULT_API_BASE_URL = "https://server.boreal.financial";

export function normalizeApiBase(raw: string | undefined | null): string {
  const trimmed = (raw ?? "").trim().replace(/\/+$/, "").replace(/(\/api)?(\/v1)?$/i, "");
  return trimmed || DEFAULT_API_BASE_URL;
}

export const API_BASE_URL = normalizeApiBase(env.VITE_API_BASE_URL as string | undefined);

// apiUrl("/website/contact") -> https://server.boreal.financial/api/website/contact
export function apiUrl(path: string): string {
  return `${API_BASE_URL}/api${path.startsWith("/") ? path : `/${path}`}`;
}

export const IS_PROD = Boolean(env.PROD);
export const IS_DEV = Boolean(env.DEV);
