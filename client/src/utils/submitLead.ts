import { API_BASE_URL } from "@/config/api";

export type WebsiteLeadPayload = {
  email: string;
  phone: string;
  requestedAmount?: string;
  productType?: string;
  businessName?: string;
};

export async function submitLead(data: WebsiteLeadPayload): Promise<{ leadId: string }> {
  const response = await fetch(`${API_BASE_URL}/api/public/lead`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("LEAD SUBMISSION FAILED");
  }

  return (await response.json()) as { leadId: string };
}
