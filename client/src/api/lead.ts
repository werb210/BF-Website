import { apiRequest } from "@/lib/api";
import { WebsiteLeadPayload } from "@/types/lead";

export async function submitLead(data: WebsiteLeadPayload) {
  return apiRequest<{ leadId: string }>("/api/leads", {
    method: "POST",
    body: data,
  });
}
