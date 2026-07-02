import { SEO } from "@/seo/SEO";

// CASL identification. The mailing address is legally required in the sender identification for
// commercial SMS. Replace the placeholder with the real registered mailing address before sending
// any marketing SMS. Confirm the legal entity name as well.
const LEGAL_NAME = "Boreal Financial Corp.";
const MAILING_ADDRESS = "[REGISTERED MAILING ADDRESS REQUIRED - set before sending marketing SMS]";
const CONTACT_EMAIL = "info@boreal.financial";
const WEBSITE = "boreal.financial";

export default function SmsInfo() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 text-white">
      <SEO title="SMS Communications & Opt-Out" description="How Boreal Financial sends SMS messages, and how to opt out." url="https://boreal.financial/sms" />
      <h1 className="text-3xl font-semibold">SMS Communications &amp; Opt-Out</h1>

      <section className="mt-6 space-y-3 text-white/85">
        <h2 className="text-xl font-semibold text-white">Who is sending you messages</h2>
        <p>{LEGAL_NAME}</p>
        <p>{MAILING_ADDRESS}</p>
        <p>
          Email: <a className="text-blue-400" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          {" "}&middot;{" "}Web: <a className="text-blue-400" href={`https://${WEBSITE}`}>{WEBSITE}</a>
        </p>
      </section>

      <section className="mt-8 space-y-3 text-white/85">
        <h2 className="text-xl font-semibold text-white">Why you received a message</h2>
        <p>
          You received a text from {LEGAL_NAME} because you have an existing business relationship
          with us or provided your consent to be contacted (for example, when you submitted an
          application). We only send messages where we have a lawful basis to do so under Canada&apos;s
          Anti-Spam Legislation (CASL).
        </p>
      </section>

      <section className="mt-8 space-y-3 text-white/85">
        <h2 className="text-xl font-semibold text-white">How to opt out</h2>
        <p>
          Reply <strong>STOP</strong> to any message to unsubscribe from marketing texts at no cost.
          Your request is honoured promptly and, in any event, within 10 business days. You can also
          email <a className="text-blue-400" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> to
          opt out.
        </p>
        <p>To resume messages after opting out, reply <strong>START</strong>.</p>
        <p className="text-sm text-white/60">Message and data rates may apply. Message frequency varies.</p>
      </section>

      <section className="mt-8 space-y-3 text-white/85">
        <h2 className="text-xl font-semibold text-white">Transactional messages</h2>
        <p>
          Some messages are service-related (for example, one-time verification codes, application
          updates, or document-signing links). These support a service you requested and are separate
          from marketing messages.
        </p>
      </section>
    </div>
  );
}
