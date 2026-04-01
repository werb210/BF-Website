import { apiPost } from "@/lib/apiClient";
import { WebsiteLeadPayload } from "@/types/lead";

export async function submitLead(payload: WebsiteLeadPayload) {
  if (!payload.email || !payload.name) {
    throw new Error("INVALID_LEAD_PAYLOAD");
  }

  try {
    return await apiPost<{ leadId: string }>("lead", payload);
  } catch (err) {
    console.error("LEAD_SUBMIT_ERROR:", err);
    alert("Submission failed");
    throw err;
  }
}
