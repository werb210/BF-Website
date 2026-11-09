// BF_WEBSITE_v789_CASL
// Canada's anti-spam law needs express consent before we send commercial
// calls, texts or emails, and the request has to name the sender and give a
// way to reach them. Every lead form shows the same unticked box and sender
// line. The form still submits without the box; marketing consent is recorded
// only when it is ticked.

export const CASL_CONSENT_TEXT =
  "I agree to receive calls, texts and emails from Boreal Financial about my inquiry. I can unsubscribe at any time.";

// BF_WEBSITE_SEPARATE_CONSENT_v1 - two unticked boxes: calls and texts, and email (HubSpot-style separate consent).
export const CASL_SMS_TEXT =
  "I agree to receive calls and text messages from Boreal Financial about my inquiry and offers. Message and data rates may apply. Reply STOP to opt out.";
export const CASL_EMAIL_TEXT =
  "I agree to receive emails from Boreal Financial, including news and offers. I can unsubscribe at any time.";

export const CASL_SENDER_LINE =
  "2630108 Alberta Ltd. o/a Boreal Financial, 450 Sparling Crt SW, Edmonton, Alberta T6X 1G9, (866) 631-8939.";

export type Consent = { sms: boolean; email: boolean };
export const NO_CONSENT: Consent = { sms: false, email: false };

export type CaslFields = {
  casl_consent: boolean;
  sms_consent: boolean;
  email_consent: boolean;
  casl_consent_text: string;
  casl_consent_at: string;
};

// Sent with every lead payload. Each box is sent on its own; casl_consent is true when either is ticked (older server
// versions read only that). The text is exactly what the visitor agreed to.
export function caslFields(consent: Consent | boolean, now: Date = new Date()): CaslFields {
  const c: Consent = typeof consent === "boolean" ? { sms: consent, email: consent } : consent;
  // A plain true/false (one combined box, older callers) keeps the combined sentence.
  const text = typeof consent === "boolean" ? "" : [c.sms ? CASL_SMS_TEXT : "", c.email ? CASL_EMAIL_TEXT : ""].filter(Boolean).join(" ");
  return {
    casl_consent: c.sms || c.email,
    sms_consent: c.sms === true,
    email_consent: c.email === true,
    casl_consent_text: text || CASL_CONSENT_TEXT,
    casl_consent_at: now.toISOString(),
  };
}
