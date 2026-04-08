import { SEO } from "@/seo/SEO";

export default function StaffLogin() {
  const staffDestination = "";

  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <SEO title="Staff Login | Boreal Financial" description="Staff access for Boreal tools and internal systems." />
      <h1 className="text-3xl font-bold">Staff Login</h1>
      <p className="mt-2 text-slate-600">Internal access for Boreal team members.</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {staffDestination ? (
          <a href={staffDestination} className="rounded-md bg-slate-900 px-4 py-2 text-center font-semibold text-white">Continue to login</a>
        ) : (
          <button type="button" className="rounded-md border px-4 py-2 text-slate-500" disabled>Continue to login</button>
        )}
        <a href="/" className="rounded-md border px-4 py-2 text-center font-semibold">Back to home</a>
      </div>
      {!staffDestination ? <p className="mt-3 text-sm text-slate-600">Not enabled in this demo build.</p> : null}
    </section>
  );
}
