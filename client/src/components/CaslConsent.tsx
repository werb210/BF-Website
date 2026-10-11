// BF_WEBSITE_v789_CASL - one consent block for every lead form.
import { CASL_CONSENT_TEXT, CASL_SENDER_LINE } from "@/lib/casl";

type Props = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  // "dark" for forms on navy panels, "light" for forms on white.
  tone?: "light" | "dark";
};

export default function CaslConsent({ id, checked, onChange, tone = "light" }: Props) {
  // Light: #0B1F3A and #51617D on white (16.5:1 and 6.3:1).
  // Dark: #f1f5f9 and #cbd5e1 on #08132a-#0a1731 (16:1 and 12:1).
  const main = tone === "dark" ? "text-[#f1f5f9]" : "text-[#0B1F3A]";
  const sub = tone === "dark" ? "text-[#cbd5e1]" : "text-[#51617D]";
  return (
    <div data-casl-consent="">
      <label htmlFor={id} className={`flex cursor-pointer items-start gap-2 text-sm leading-snug ${main}`}>
        <input
          id={id}
          name="casl_consent"
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0"
        />
        <span>{CASL_CONSENT_TEXT}</span>
      </label>
      <p className={`mt-1.5 text-xs leading-snug ${sub}`}>{CASL_SENDER_LINE}</p>
    </div>
  );
}
