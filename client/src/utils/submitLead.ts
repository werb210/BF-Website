import { apiPost } from "@/lib/apiClient";
import { WebsiteLeadPayload } from "@/types/lead";

export async function submitLead(payload: WebsiteLeadPayload) {
  return apiPost<{ leadId: string }>("/api/lead", payload);
}
