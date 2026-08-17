// BF_WEBSITE_PRIVACY_v20
// Drafted against PIPEDA and Alberta PIPA. Counsel has not signed this off yet;
// the Quebec / Law 25 position in particular is unresolved. It replaces a
// two-sentence placeholder that disclosed none of the tracking the site runs.
import SEO from "@/components/SEO";

const LEGAL_NAME = "Boreal Financial Corp.";
const MAILING_ADDRESS = "450 Sparling Crt SW, Edmonton, AB T6X 1G9";
const CONTACT_EMAIL = "info@boreal.financial";
const PHONE_DISPLAY = "+1 (825) 451-1768";
const LAST_UPDATED = "August 16, 2026";

type Section = { heading: string; paras?: string[]; bullets?: string[] };

const SECTIONS: Section[] = [
  {
    heading: "Who is responsible for your information",
    paras: [
      `${LEGAL_NAME}, ${MAILING_ADDRESS}. You can reach our privacy contact at ${CONTACT_EMAIL} or on ${PHONE_DISPLAY}.`,
      "This policy covers boreal.financial, client.boreal.financial, and any communication you have with us by phone, SMS or email.",
    ],
  },
  {
    heading: "What we collect",
    paras: [
      "Information you give us. When you use the credit readiness check, the contact form or the application, you provide business and personal details. Depending on how far you go, that can include your name, business name, email address, telephone number, business address, industry, revenue figures, the amount and purpose of the financing you are seeking, ownership details, and the business bank statements and financial documents you upload.",
      "Information about owners and guarantors. Where a financing request requires it, we collect information about business owners, directors and personal guarantors, including name, date of birth, home address and, where a lender requires it, government identification numbers. Where you give us information about another person, you confirm you are authorised to do so.",
      "Information collected automatically. IP address, browser and device type, pages viewed, time on page, referring URL, and the advertising click identifiers described below.",
      "Information from other sources. Business information from public registries and commercial credit reference agencies, and information from the lenders and partners involved in your file.",
    ],
  },
  {
    heading: "Why we use it",
    bullets: [
      "To assess your request and match it to lenders on our panel",
      "To send your file to lenders you have asked us to approach",
      "To communicate with you about your application by phone, email or SMS",
      "To meet legal, regulatory, anti-money-laundering and record-keeping obligations",
      "To detect and prevent fraud",
      "To measure and improve our website and our advertising",
      "With your consent, to send you marketing communications",
    ],
  },
  {
    heading: "Credit checks",
    paras: [
      "We do not obtain a consumer credit report on you. A lender may obtain one after you have signed a term sheet, and it will do so under its own consent arrangements with you, not ours. We may access commercial credit information about the business itself.",
    ],
  },
  {
    heading: "Cookies, analytics and advertising",
    paras: [
      "Strictly necessary cookies keep the site working and cannot be switched off.",
      "Analytics. We use Google Analytics 4 and Microsoft Clarity to understand how the site is used. Clarity records session activity including mouse movement, scrolling and clicks. Both set cookies and receive your IP address.",
      "Advertising. We use Google Ads conversion tracking and remarketing. This sets cookies that let Google recognise your browser across our sites and on other websites, and show you Boreal advertising elsewhere. If you arrive from an advertisement, a Google click identifier is stored in your browser and passed to our application so we can attribute the enquiry.",
      "Consent. We operate Google Consent Mode. Choosing Accept on our banner grants advertising and analytics storage; choosing Decline refuses both. You can change your choice at any time by clearing site data for this site and making a new selection.",
      "We do not sell your personal information, and we do not display third-party advertising on our own websites.",
    ],
  },
  {
    heading: "Who we share it with",
    bullets: [
      "Lenders and funding partners, so they can assess your request. Once a lender receives your file it handles that information under its own privacy policy, which we do not control.",
      "Service providers who host, secure and operate our systems, including Microsoft Azure for hosting and document storage, Twilio for telephony and SMS, SignNow for document signing, SendGrid for email, and Google and Microsoft for the analytics and advertising described above.",
      "Professional advisers, regulators and law enforcement, where we are required or permitted by law.",
      "A purchaser, if the business or its assets are sold.",
    ],
  },
  {
    heading: "Where your information is held",
    paras: [
      "Our systems are hosted on Microsoft Azure. Some of our service providers process information in the United States and other countries, where it may be subject to lawful access requests by foreign authorities.",
    ],
  },
  {
    heading: "How long we keep it",
    paras: [
      "We keep financing applications and supporting documents for as long as we need them to provide the service and to meet our legal, regulatory and anti-money-laundering obligations. We keep marketing contact details until you withdraw consent.",
    ],
  },
  {
    heading: "Your choices",
    paras: [
      "You can ask us for access to the personal information we hold about you, ask us to correct it, or withdraw consent to marketing at any time. To stop SMS, reply STOP. To stop marketing email, use the unsubscribe link. If you withdraw consent for information we need in order to process an application, we cannot continue with it.",
      `Send requests to ${CONTACT_EMAIL}. We respond within 30 days.`,
      "If you are not satisfied with our response, you can complain to the Office of the Privacy Commissioner of Canada, or to the Office of the Information and Privacy Commissioner of Alberta.",
    ],
  },
  {
    heading: "Security",
    paras: [
      "We use encryption in transit and at rest, access controls, and multi-factor authentication on internal systems. No system is completely secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    heading: "Children",
    paras: [
      "Our services are for businesses. We do not knowingly collect information from anyone under 18.",
    ],
  },
  {
    heading: "Changes to this policy",
    paras: [
      "We will post any changes on this page and update the date above.",
    ],
  },
];

export default function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="How Boreal Financial Corp. collects, uses, shares and protects personal information, including cookies, analytics and advertising."
        url="https://www.boreal.financial/privacy"
      />
      <main className="bg-white font-sans text-boreal-ink">
        <section className="bg-gradient-to-br from-boreal-ink via-boreal-inkDeep to-[#0d233f]">
          <div className="mx-auto max-w-[820px] px-6 py-14 md:py-20">
            <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-[15px] text-[#c3cfe0]">{`Last updated ${LAST_UPDATED}`}</p>
          </div>
        </section>

        <section className="mx-auto max-w-[820px] px-6 py-16 md:py-20">
          <p className="text-[17px] leading-relaxed text-boreal-body">
            {`${LEGAL_NAME} arranges commercial financing for businesses in Canada and the United States. This policy explains what personal information we collect, why we collect it, who we share it with, and the choices available to you.`}
          </p>

          {SECTIONS.map((section) => (
            <div key={section.heading} className="mt-12">
              <h2 className="font-display text-2xl font-bold">{section.heading}</h2>
              {section.paras?.map((text) => (
                <p key={text.slice(0, 40)} className="mt-4 text-[16px] leading-relaxed text-boreal-body">
                  {text}
                </p>
              ))}
              {section.bullets ? (
                <ul className="mt-4 space-y-2.5">
                  {section.bullets.map((text) => (
                    <li
                      key={text.slice(0, 40)}
                      className="flex gap-3 text-[16px] leading-relaxed text-boreal-body"
                    >
                      <span aria-hidden className="text-boreal-gold">
                        &bull;
                      </span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </section>

        <section className="border-t border-boreal-line bg-boreal-mist">
          <div className="mx-auto max-w-[820px] px-6 py-12">
            <h2 className="font-display text-xl font-bold">Contact us about privacy</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-boreal-body">
              {`${LEGAL_NAME}, ${MAILING_ADDRESS}. Email ${CONTACT_EMAIL} or call ${PHONE_DISPLAY}.`}
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
