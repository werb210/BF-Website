import { apiPost } from "@/lib/apiClient";
import { WebsiteLeadPayload } from "@/types/lead";

export async function submitLead(data: WebsiteLeadPayload) {
  return apiPost<{ leadId: string }>("lead", data);
}
