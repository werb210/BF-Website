const faqItems = [
  {
    question: "How quickly can I access capital?",
    answer:
      "Qualified businesses can receive approvals within days depending on documentation and underwriting readiness.",
  },
  {
    question: "What industries do you serve?",
    answer: "Construction, transportation, manufacturing, retail, and many other established Canadian sectors.",
  },
  {
    question: "What collateral is accepted?",
    answer: "A/R, inventory, equipment, or real estate may be used to structure capital solutions.",
  },
];

export default function FAQ() {
  return (
    <section className="section section-dark">
      <div className="container">
        <div className="faq-block">
          <h2>Frequently asked questions</h2>
          <div className="faq-list" role="list">
            {faqItems.map((item) => (
              <details key={item.question} className="faq-item" role="listitem">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
