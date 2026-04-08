export default function ProductComparison() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-8 text-3xl font-bold">Product Comparison</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-gray-900 p-6">
            <h3 className="mb-4 font-semibold">Line of Credit</h3>
            <p>Flexible revolving capital for ongoing needs.</p>
          </div>
          <div className="rounded-xl bg-gray-900 p-6">
            <h3 className="mb-4 font-semibold">Term Loan</h3>
            <p>Structured lump-sum financing with fixed repayment.</p>
          </div>
          <div className="rounded-xl bg-gray-900 p-6">
            <h3 className="mb-4 font-semibold">Equipment Financing</h3>
            <p>Asset-backed financing aligned to equipment life.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
