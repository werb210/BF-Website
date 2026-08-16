// BF_WEBSITE_LEGAL_v8 - class-only restyle. The CASL identification text and
// mailing address are untouched; they are a legal requirement, not copy.
import { SEO } from "@/seo/SEO";

// BF_WEBSITE_SMS_ADDRESS_v1
// CASL identification: the mailing address is legally required in the sender identification
// for commercial SMS. This shipped with a literal missing-address placeholder,
// which would have rendered verbatim on the public page the moment the route
// became reachable -- and this is the page every marketing SMS footer links to.
const LEGAL_NAME = "Boreal Financial Corp.";
const MAILING_ADDRESS = "450 Sparling Crt SW, Edmonton, AB T6X 1G9";
const CONTACT_EMAIL = "info@boreal.financial";
const WEBSITE = "boreal.financial";

export default function SmsInfo() {
  return (
    <div className="mx-auto max-w-[820px] px-6 py-16 font-sans text-boreal-ink">
      <SEO title="SMS Communications & Opt-Out" description="How Boreal Financial sends SMS messages, and how to opt out." url="https://www.boreal.financial/sms" />
      <h1 className="font-display text-4xl font-bold text-boreal-ink">SMS Communications &amp; Opt-Out</h1>

      <section className="mt-8 space-y-4 text-[16px] leading-relaxed text-boreal-body">
        <h2 className="font-display text-xl font-bold text-boreal-ink">Who is sending you messages</h2>
        <p>{LEGAL_NAME}</p>
        <p>{MAILING_ADDRESS}</p>
        <p>
          Email: <a className="font-semibold text-boreal-goldDeep hover:underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          {" "}&middot;{" "}Web: <a className="font-semibold text-boreal-goldDeep hover:underline" href={`https://${WEBSITE}`}>{WEBSITE}</a>
        </p>
      </section>

      <section className="mt-10 space-y-4 text-[16px] leading-relaxed text-boreal-body">
        <h2 className="font-display text-xl font-bold text-boreal-ink">Why you received a message</h2>
        <p>
          You received a text from {LEGAL_NAME} because you have an existing business relationship
          with us or provided your consent to be contacted (for example, when you submitted an
          application). We only send messages where we have a lawful basis to do so under Canada&apos;s
          Anti-Spam Legislation (CASL).
        </p>
      </section>

      <section className="mt-10 space-y-4 text-[16px] leading-relaxed text-boreal-body">
        <h2 className="font-display text-xl font-bold text-boreal-ink">How to opt out</h2>
        <p>
          Reply <strong>STOP</strong> to any message to unsubscribe from marketing texts at no cost.
          Your request is honoured promptly and, in any event, within 10 business days. You can also
          email <a className="font-semibold text-boreal-goldDeep hover:underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> to
          opt out.
        </p>
        <p>To resume messages after opting out, reply <strong>START</strong>.</p>
        <p className="text-sm text-boreal-body">Message and data rates may apply. Message frequency varies.</p>
      </section>

      <section className="mt-10 space-y-4 text-[16px] leading-relaxed text-boreal-body">
        <h2 className="font-display text-xl font-bold text-boreal-ink">Transactional messages</h2>
        <p>
          Some messages are service-related (for example, one-time verification codes, application
          updates, or document-signing links). These support a service you requested and are separate
          from marketing messages.
        </p>
      </section>
    </div>
  );
}
