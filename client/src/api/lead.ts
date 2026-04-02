import { apiRequest } from "@/lib/api";
import { retry } from "@/lib/retry";
import { WebsiteLeadPayload } from "@/types/lead";

export async function submitLead(data: WebsiteLeadPayload) {
  return retry(
    () =>
      apiRequest<{ leadId: string }>("/api/lead", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    3,
    500,
  );
}
