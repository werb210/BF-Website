import { APPLY_URL } from "@/config/site";
import { submitLead } from "@/utils/submitLead";

export type HandoffPayload = {
  businessName: string;
  email: string;
  phone: string;
  requestedAmount?: string;
  productType: string;
};

export async function redirectToClientApply(payload: HandoffPayload) {
  const businessName = payload.businessName.trim();
  const email = payload.email.trim();
  const phone = payload.phone.trim();

  if (!email || !phone) {
    throw new Error("MISSING REQUIRED FIELDS");
  }

  const normalizedRequestedAmount = payload.requestedAmount?.trim();
  const parsedRequestedAmount = normalizedRequestedAmount ? Number(normalizedRequestedAmount) : undefined;

  const { leadId } = await submitLead({
    businessName,
    email,
    phone,
    requestedAmount: Number.isFinite(parsedRequestedAmount) ? parsedRequestedAmount : undefined,
    productType: payload.productType.trim(),
  });

  if (!leadId) {
    throw new Error("[HANDOFF FAILED]");
  }

  window.location.href = `${APPLY_URL}?leadId=${encodeURIComponent(leadId)}`;
}
