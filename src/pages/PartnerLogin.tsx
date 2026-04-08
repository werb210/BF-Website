import { SEO } from "@/seo/SEO";

export default function PartnerLogin() {
  const partnerDestination = "";

  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <SEO title="Lender/Referrer Login | Boreal Financial" description="Portal access for Boreal lending and referral partners." />
      <h1 className="text-3xl font-bold">Lender/Referrer Login</h1>
      <p className="mt-2 text-slate-600">Access for lenders and referral partners.</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {partnerDestination ? (
          <a href={partnerDestination} className="rounded-md bg-slate-900 px-4 py-2 text-center font-semibold text-white">Continue to login</a>
        ) : (
          <button type="button" className="rounded-md border px-4 py-2 text-slate-500" disabled>Continue to login</button>
        )}
        <a href="/" className="rounded-md border px-4 py-2 text-center font-semibold">Back to home</a>
      </div>
      {!partnerDestination ? <p className="mt-3 text-sm text-slate-600">Not enabled in this demo build.</p> : null}
    </section>
  );
}
