export const API_BASE_URL = "https://boreal-staff-server.azurewebsites.net";

export function apiUrl(path: string): string {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  return `${API_BASE_URL}${path}`;
}
