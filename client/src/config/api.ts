import { apiCall } from "@/lib/api";

export const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path: string, options: RequestInit = {}) {
  return apiCall(path, options);
}
