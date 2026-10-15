// BF_WEBSITE_LEGAL_v8 - class-only restyle. The CASL identification text and
// mailing address are untouched; they are a legal requirement, not copy.
import SEO from "@/components/SEO";

// BF_WEBSITE_SMS_ADDRESS_v1
// CASL identification: the mailing address is legally required in the sender identification
// for commercial SMS. This shipped with a literal missing-address placeholder,
// which would have rendered verbatim on the public page the moment the route
// became reachable -- and this is the page every marketing SMS footer links to.
const LEGAL_NAME = "Boreal Financial, a trade name of 2630108 Alberta Ltd."; // BF_WEBSITE_LEGAL_NAME_v179
const MAILING_ADDRESS = "450 Sparling Crt SW, Edmonton, AB T6X 1G9";
const CONTACT_EMAIL = "info@boreal.financial";
const WEBSITE = "boreal.financial";

export default function SmsInfo() {
  return (
    // BF_WEBSITE_SMS_READABLE_v161 - the page had no background of its own, so dark text sat on the
    // site's dark background. Same white panel as the Privacy and Terms pages.
    <main className="bg-white font-sans text-boreal-ink">
    <div className="mx-auto max-w-[820px] px-6 py-16 font-sans text-boreal-ink">
      <SEO title="SMS Communications & Opt-Out" description="How Boreal Financial sends SMS messages, and how to opt out." url="https://www.boreal.financial/sms" />
      <h1 className="font-display text-4xl font-bold text-boreal-ink">SMS Communications &amp; Opt-Out</h1>

      <section className="mt-8 space-y-4 text-[16px] leading-relaxed text-boreal-body">
        <h2 className="font-display text-xl font-bold text-boreal-ink">Who is sending you messages</h2>
        {/* BF_WEBSITE_v806_TFV - the program name carriers look for. */}
        <p>Program: <strong>Boreal Financial Application Updates</strong></p>
        <p>{LEGAL_NAME}</p>
        <p>{MAILING_ADDRESS}</p>
        <p>
          Email: <a className="font-semibold text-boreal-goldInk hover:underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          {" "}&middot;{" "}Web: <a className="font-semibold text-boreal-goldInk hover:underline" href={`https://${WEBSITE}`}>{WEBSITE}</a>
        </p>
      </section>

      <section className="mt-10 space-y-4 text-[16px] leading-relaxed text-boreal-body">
        <h2 className="font-display text-xl font-bold text-boreal-ink">Why you received a message</h2>
        {/* BF_WEBSITE_v809_SMS_UPDATES_CONSENT */}
        <p>
          You received a text from {LEGAL_NAME} because you asked for a sign-in code, ticked a box to receive
          texts from us (see &ldquo;How you opt in&rdquo; below), or are in a conversation with one of our staff.
          We only send messages where we have a lawful basis to do so under Canada&apos;s Anti-Spam Legislation
          (CASL) and US rules.
        </p>
      </section>

      <section className="mt-10 space-y-4 text-[16px] leading-relaxed text-boreal-body">
        <h2 className="font-display text-xl font-bold text-boreal-ink">How to opt out</h2>
        <p>
          Reply <strong>STOP</strong> to any message to opt out, at no cost. Reply <strong>HELP</strong> for help.
          Your request is honoured promptly and, in any event, within 10 business days. You can also
          email <a className="font-semibold text-boreal-goldInk hover:underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> to
          opt out.
        </p>
        <p>To resume messages after opting out, reply <strong>START</strong>.</p>
        <p className="text-sm text-boreal-body">Message frequency varies. Message and data rates may apply. Support: {CONTACT_EMAIL} or (866) 631-8939.</p>
      </section>

      {/* BF_WEBSITE_SMS_POLICY_v160 - public proof of the opt-in for carrier toll-free verification. */}
      <section className="mt-10 space-y-4 text-[16px] leading-relaxed text-boreal-body">
        <h2 className="font-display text-xl font-bold text-boreal-ink">How you opt in</h2>
        {/* BF_WEBSITE_v809_SMS_UPDATES_CONSENT - texting is the applicant's own choice: unticked, optional boxes. */}
        <p>
          To start or sign in to an application at client.boreal.financial you enter your mobile number and we
          text you a one-time sign-in code. Under the number box there is a separate checkbox, which is not
          ticked for you and is not required to apply:
        </p>
        <blockquote className="border-l-4 border-boreal-goldDeep pl-4 italic">
          &#9744; Text me updates about my application: status updates, document requests and signing reminders. Message frequency varies. Message and data rates may apply. Reply STOP to opt out, HELP for help. Not required to apply.
        </blockquote>
        <p>
          Only applicants who tick this box get texts about their application. Everyone else is kept up to
          date by email and in their client portal. You can change your choice at any time in the Settings of
          your client portal, or reply STOP.
        </p>
        <p>
          On the last step of the application there is a second, separate checkbox for marketing texts, also
          not ticked for you and not required to apply:
        </p>
        <blockquote className="border-l-4 border-boreal-goldDeep pl-4 italic">
          &#9744; Optional: Text me news, tips and offers from Boreal Financial. Up to 4 messages per month. Message and data rates may apply. Reply STOP to opt out at any time. Not required to apply.
        </blockquote>
        <p>
          No mobile information will be shared with third parties or affiliates for marketing or
          promotional purposes. Text messaging opt-in data and consent will not be shared with any third
          parties. We collect your consent ourselves, on our own application; we never buy or receive phone
          numbers from lead sellers or other third parties, and we never text on behalf of lenders or anyone else.
        </p>
      </section>
      <section className="mt-10 space-y-4 text-[16px] leading-relaxed text-boreal-body">
        <h2 className="font-display text-xl font-bold text-boreal-ink">Transactional messages</h2>
        <p>
          Texts about your application (one-time sign-in codes, application updates, document requests and
          signing links) support a service you asked for. Our toll-free number, (866) 631-8939, sends only these
          application messages. Marketing texts go only to people who tick the separate, optional
          &ldquo;Text me news, tips and offers from Boreal Financial&rdquo; box; reply STOP to any of them to opt out.
        </p>
      </section>
    </div>
    </main>
  );
}
