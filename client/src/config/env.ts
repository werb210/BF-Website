type Env = {
  API_URL: string;
  // Backward-compatible fields used across the app.
  VITE_API_URL: string;
  MODE: string;
  VITE_SITE_URL: string;
  VITE_GA_ID?: string;
  VITE_MAYA_ENABLED: boolean;
  VITE_MAYA_WS_BASE: string;
};

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  if (!import.meta.env.VITE_API_URL) {
    throw new Error("Missing VITE_API_URL");
  }

  cachedEnv = {
    API_URL: import.meta.env.VITE_API_URL,
    VITE_API_URL: import.meta.env.VITE_API_URL,
    MODE: import.meta.env.MODE,
    VITE_SITE_URL: "https://borealfinancial.ca",
    VITE_GA_ID: undefined,
    VITE_MAYA_ENABLED: false,
    VITE_MAYA_WS_BASE: "",
  };

  return cachedEnv;
}

export const env = getEnv();
