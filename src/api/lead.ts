import { api } from "@/lib/api";
import { WebsiteLeadPayload } from "@/types/lead";

export async function submitLead(data: WebsiteLeadPayload) {
  return api<{ leadId: string }>("/api/crm/lead", {
    method: "POST",
    body: data,
  });
}
