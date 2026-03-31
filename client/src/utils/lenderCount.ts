import { apiRequest } from "@/lib/api";

export async function fetchLenderCount(): Promise<number> {
  const result = await apiRequest<{ count?: number }>("/api/public/lender-count", { method: "GET" });
  if (!result.success) {
    return 0;
  }

  return result.data?.count || 0;
}
