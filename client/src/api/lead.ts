import { api } from "@/lib/api";
import { WebsiteLeadPayload } from "@/types/lead";

export async function submitLead(data: WebsiteLeadPayload) {
  return api<{ leadId: string }>("/api/leads", {
    method: "POST",
    body: data,
  });
}
