import { apiRequest, type ApiResult } from "@/lib/api";

type LeadResponse = {
  leadId?: string;
};

export async function submitLead(data: Record<string, unknown>): Promise<ApiResult<LeadResponse>> {
  return apiRequest<LeadResponse>("/leads", {
    method: "POST",
    body: data,
  });
}
