import { apiRequest } from "@/lib/api";

export type WebsiteLeadPayload = {
  email: string;
  phone: string;
  requestedAmount?: number;
  productType: string;
  businessName: string;
};

export async function submitLead(data: WebsiteLeadPayload): Promise<{ leadId: string }> {
  const result = await apiRequest<{ leadId?: string }>("/api/public/lead", {
    method: "POST",
    body: data,
  });

  if (!result.success || !result.data?.leadId) {
    throw new Error(result.success ? "[HANDOFF FAILED]" : result.message || "[LEAD SUBMIT FAILED]");
  }

  return { leadId: result.data.leadId };
}
