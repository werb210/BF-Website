import { apiPost } from "@/lib/apiClient";
import { WebsiteLeadPayload } from "@/types/lead";

export async function submitLead(payload: WebsiteLeadPayload) {
  if (!payload.email || !payload.name) {
    throw new Error("Invalid lead payload");
  }

  return apiPost<{ leadId: string }>("/api/lead", payload);
}
