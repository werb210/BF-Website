// BF_WEBSITE_v789_CASL
// Canada's anti-spam law needs express consent before we send commercial
// calls, texts or emails, and the request has to name the sender and give a
// way to reach them. Every lead form shows the same unticked box and sender
// line. The form still submits without the box; marketing consent is recorded
// only when it is ticked.

export const CASL_CONSENT_TEXT =
  "I agree to receive calls, texts and emails from Boreal Financial about my inquiry. I can unsubscribe at any time.";

export const CASL_SENDER_LINE =
  "2630108 Alberta Ltd. o/a Boreal Financial, 450 Sparling Crt SW, Edmonton, Alberta T6X 1G9, (866) 631-8939.";

export type CaslFields = {
  casl_consent: boolean;
  casl_consent_text: string;
  casl_consent_at: string;
};

// Sent with every lead payload. casl_consent is true only when the visitor
// ticked the box; casl_consent_at is when that choice was submitted.
export function caslFields(consent: boolean, now: Date = new Date()): CaslFields {
  return {
    casl_consent: consent === true,
    casl_consent_text: CASL_CONSENT_TEXT,
    casl_consent_at: now.toISOString(),
  };
}
