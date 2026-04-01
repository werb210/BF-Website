import { apiGet } from "@/lib/apiClient";

export async function fetchLenderCount(): Promise<number> {
  try {
    const result = await apiGet<{ count?: number }>("/api/public/lender-count");
    return result.count || 0;
  } catch {
    return 0;
  }
}
