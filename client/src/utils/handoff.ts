import { APPLY_URL } from "@/config/site";

export type HandoffPayload = {
  businessName: string;
  email: string;
  phone: string;
  requestedAmount?: string;
  productType?: string;
};

export function redirectToClientApply(payload: HandoffPayload) {
  const businessName = payload.businessName.trim();
  const email = payload.email.trim();
  const phone = payload.phone.trim();

  if (!email || !phone) {
    throw new Error("MISSING REQUIRED FIELDS");
  }

  const normalizedPayload: Record<string, string> = {
    businessName,
    email,
    phone,
    requestedAmount: payload.requestedAmount?.trim() ?? "",
    productType: payload.productType?.trim() ?? "",
  };

  window.location.href = `${APPLY_URL}?${new URLSearchParams(normalizedPayload).toString()}`;
}
