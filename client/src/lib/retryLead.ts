import { clearLead, getLead, saveLead } from "@/lib/leadStorage";

export async function retryLeadSubmission(sendFn: (data: Record<string, unknown>) => Promise<void>) {
  const lead = getLead();
  if (!lead) return;

  try {
    await sendFn(lead.data);
    clearLead();
  } catch (error) {
    console.error("LEAD_RETRY_ERROR:", error);
    lead.retryCount += 1;
    saveLead(lead);
  }
}
