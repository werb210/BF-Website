export const API_BASE_URL = "https://server.boreal.financial";

export function apiUrl(path: string): string {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  return `${API_BASE_URL}${path}`;
}
