import CreditReadiness from "@/components/CreditReadiness";

export default function CapitalReadiness() {
  return (
    <main className="bg-[#020817] px-5 py-10 text-white md:px-6 md:py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-3 text-3xl font-bold md:text-5xl">Credit Readiness</h1>
        <p className="text-xl font-semibold md:text-2xl">Tell us about your business</p>
      </div>
      <CreditReadiness />
    </main>
  );
}
