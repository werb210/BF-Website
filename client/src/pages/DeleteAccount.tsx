// BF_WEBSITE_DELETE_ACCOUNT_v170
// Account and data deletion page for the Boreal Financial app (Google Play
// requires a public URL that names the app, gives the steps, and says what is
// deleted, what is kept and for how long). Wording matches what the app does:
// "Delete account" in the client portal permanently deletes the application and
// everything attached to it.
import SEO from "@/components/SEO";

const CONTACT_EMAIL = "info@boreal.financial";
const PHONE_DISPLAY = "+1 (866) 631-8939";

export const DELETE_STEPS = [
  "Open the Boreal Financial app, or go to client.boreal.financial, and sign in with your mobile number.",
  "In your client portal, tap Delete account at the bottom of the page.",
  "Read the two warnings and tap Delete my account to confirm.",
];

export const DELETED_ITEMS = [
  "Your application and the answers you gave in it",
  "Documents you uploaded",
  "Messages between you and our team in the app",
  "Signing records and signed documents for that application",
  "Call and text records linked to the application",
];

export const KEPT_ITEMS = [
  "A basic contact record (name, phone number and email) and your opt-out choices, so we can keep honouring an unsubscribe or STOP request.",
  "Records we are required by law to keep, such as records of financing that was completed and fees that were paid. These are kept only for as long as the law requires and are then deleted.",
];

export default function DeleteAccount() {
  return (
    <>
      <SEO
        title="Delete your account"
        description="How to delete your Boreal Financial app account and application data, what is deleted, and what is kept."
        url="https://www.boreal.financial/delete-account"
      />
      <main className="bg-white font-sans text-boreal-ink">
        <section className="bg-gradient-to-br from-boreal-ink via-boreal-inkDeep to-[#0d233f]">
          <div className="mx-auto max-w-[820px] px-6 py-14 md:py-20">
            <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">Delete your account</h1>
            <p className="mt-4 text-[17px] text-[#e2e8f0]">For the Boreal Financial app (Android and iPhone) and client.boreal.financial.</p>
          </div>
        </section>

        <section className="mx-auto max-w-[820px] px-6 py-16 md:py-20">
          <h2 className="font-display text-2xl font-bold">Delete it yourself in the app</h2>
          <ol className="mt-4 list-decimal space-y-2.5 pl-6 text-[16px] leading-relaxed text-boreal-body">
            {DELETE_STEPS.map((s) => (<li key={s}>{s}</li>))}
          </ol>
          <p className="mt-4 text-[16px] leading-relaxed text-boreal-body">Deletion happens immediately and cannot be undone.</p>

          <h2 className="mt-12 font-display text-2xl font-bold">Or ask us to delete it</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-boreal-body">
            {`Email ${CONTACT_EMAIL} from the email address on your application, or call ${PHONE_DISPLAY}, and ask us to delete your account. We confirm it is you, then delete your account within 30 days and email you when it is done. You can also ask us to delete the basic contact record described below.`}
          </p>

          <h2 className="mt-12 font-display text-2xl font-bold">What is deleted</h2>
          <ul className="mt-4 space-y-2.5">
            {DELETED_ITEMS.map((t) => (
              <li key={t} className="flex gap-3 text-[16px] leading-relaxed text-boreal-body"><span aria-hidden className="text-boreal-goldInk">&bull;</span><span>{t}</span></li>
            ))}
          </ul>

          <h2 className="mt-12 font-display text-2xl font-bold">What is kept, and for how long</h2>
          <ul className="mt-4 space-y-2.5">
            {KEPT_ITEMS.map((t) => (
              <li key={t} className="flex gap-3 text-[16px] leading-relaxed text-boreal-body"><span aria-hidden className="text-boreal-goldInk">&bull;</span><span>{t}</span></li>
            ))}
          </ul>
          <p className="mt-6 text-[16px] leading-relaxed text-boreal-body">
            Lenders that already received your application keep their own copy under their own privacy policies. Deleting your Boreal account does not delete their records; contact the lender directly.
          </p>
          <p className="mt-6 text-[16px] leading-relaxed text-boreal-body">
            See our <a href="/privacy" className="font-semibold text-boreal-goldInk hover:underline">Privacy Policy</a> for more.
          </p>
        </section>
      </main>
    </>
  );
}
