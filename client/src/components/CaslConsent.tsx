// BF_WEBSITE_v789_CASL - one consent block for every lead form.
// BF_WEBSITE_SEPARATE_CONSENT_v1 - two unticked boxes: calls and texts, and email. Each is recorded on its own.
import { CASL_EMAIL_TEXT, CASL_SENDER_LINE, CASL_SMS_TEXT, type Consent } from "@/lib/casl";

type Props = {
  id: string;
  value: Consent;
  onChange: (value: Consent) => void;
  // "dark" for forms on navy panels, "light" for forms on white.
  tone?: "light" | "dark";
};

export default function CaslConsent({ id, value, onChange, tone = "light" }: Props) {
  // Light: #0B1F3A and #51617D on white (16.5:1 and 6.3:1).
  // Dark: #f1f5f9 and #cbd5e1 on #08132a-#0a1731 (16:1 and 12:1).
  const main = tone === "dark" ? "text-[#f1f5f9]" : "text-[#0B1F3A]";
  const sub = tone === "dark" ? "text-[#cbd5e1]" : "text-[#51617D]";
  const box = (key: keyof Consent, text: string) => (
    <label htmlFor={`${id}-${key}`} className={`flex cursor-pointer items-start gap-2 text-sm leading-snug ${main}`}>
      <input
        id={`${id}-${key}`}
        name={key === "sms" ? "sms_consent" : "email_consent"}
        type="checkbox"
        checked={value[key]}
        onChange={(e) => onChange({ ...value, [key]: e.target.checked })}
        className="mt-0.5 h-4 w-4 shrink-0"
      />
      <span>{text}</span>
    </label>
  );
  return (
    <div data-casl-consent="" className="space-y-2">
      {box("sms", CASL_SMS_TEXT)}
      {box("email", CASL_EMAIL_TEXT)}
      <p className={`mt-1.5 text-xs leading-snug ${sub}`}>{CASL_SENDER_LINE}</p>
    </div>
  );
}
