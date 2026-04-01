export function getApiBaseUrl() {
  const url = import.meta.env.VITE_API_URL;

  if (!url) {
    throw new Error("VITE_API_URL_NOT_DEFINED");
  }

  return url;
}
