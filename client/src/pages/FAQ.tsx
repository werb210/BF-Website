export default function FAQ() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="mb-8 text-4xl font-bold">
          Frequently Asked Questions
        </h1>

        <div className="max-w-3xl space-y-4">
          <details className="faq-item">
            <summary>How quickly can I access capital?</summary>
            <p>
              Funding timelines depend on the structure, but approvals
              can occur within days once underwriting is complete.
            </p>
          </details>

          <details className="faq-item">
            <summary>What industries do you serve?</summary>
            <p>
              Manufacturing, distribution, transportation, retail,
              professional services, construction, and many others.
            </p>
          </details>

          <details className="faq-item">
            <summary>What collateral is accepted?</summary>
            <p>
              Receivables, inventory, equipment, contracts,
              and other structured business assets.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}
