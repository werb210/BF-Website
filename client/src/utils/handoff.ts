import { APPLY_URL } from "@/config/site";
import { submitLead } from "@/utils/submitLead";

export type HandoffPayload = {
  businessName: string;
  email: string;
  phone: string;
  productType: string;
  requestedAmount?: string;
};

export async function redirectToClientApply(payload: HandoffPayload) {
  const businessName = payload.businessName.trim();
  const email = payload.email.trim();
  const phone = payload.phone.trim();

  if (!email || !phone) {
    throw new Error("MISSING REQUIRED FIELDS");
  }


  const { leadId } = await submitLead({
    name: businessName,
    businessName,
    email,
    phone,
    productType: payload.productType.trim(),
  });

  if (!leadId) {
    throw new Error("[HANDOFF FAILED]");
  }

  window.location.href = `${APPLY_URL}?leadId=${encodeURIComponent(leadId)}`;
}
