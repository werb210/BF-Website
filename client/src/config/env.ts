export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || "",
  CLIENT_APP_URL: import.meta.env.VITE_CLIENT_APP_URL || "",
};

export function assertEnv() {
  if (!ENV.API_URL) throw new Error("VITE_API_URL missing");
  if (!ENV.CLIENT_APP_URL) throw new Error("VITE_CLIENT_APP_URL missing");
}
