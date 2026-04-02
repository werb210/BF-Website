import { APPLY_URL } from "@/config/site";
import { submitLead } from "@/utils/submitLead";

export type HandoffPayload = {
  businessName: string;
  email: string;
  phone: string;
  productType: string;
  requestedAmount?: string;
};

export function redirectToApplication(leadId: string) {
  window.location.href = `${APPLY_URL}?leadId=${leadId}`;
}

export async function redirectToClientApply(payload: HandoffPayload) {
  const businessName = payload.businessName.trim();
  const email = payload.email.trim();
  const phone = payload.phone.trim();

  if (!email || !phone) {
    throw new Error("MISSING REQUIRED FIELDS");
  }

  const { leadId } = await submitLead({
    name: businessName,
    company: businessName,
    email,
    phone,
  });

  if (!leadId) {
    throw new Error("[HANDOFF FAILED]");
  }

  redirectToApplication(leadId);
}
