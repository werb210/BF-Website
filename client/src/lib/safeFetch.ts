import { apiRequest } from "@/lib/api";

export async function safeFetch(url: string, options: RequestInit = {}) {
  const result = await apiRequest<unknown>(url, options);

  if (!result.success) {
    throw new Error(result.message);
  }

  return result.data;
}
