export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: "How quickly can I receive funding from Boreal Financial?",
    answer:
      "Most clients receive initial feedback in one business day. Final funding timelines vary based on document readiness and underwriting complexity."
  },
  {
    question: "Do you work with startups and new businesses?",
    answer:
      "Yes. Boreal Financial supports startup businesses with funding programs tailored to early-stage growth, cash-flow stabilization, and inventory or equipment needs."
  },
  {
    question: "Can I apply if I have challenged credit?",
    answer:
      "Yes. We partner with lenders that evaluate cash flow, receivables, and business performance in addition to credit score."
  }
];


const baseFaqs: FaqItem[] = [
  {
    question: "What documents are needed to apply?",
    answer:
      "Most applicants start with recent bank statements, a government-issued ID, and basic business performance details. Requirements can vary by product and lender program."
  },
  {
    question: "How quickly can funding be approved?",
    answer:
      "Many files receive initial feedback within one business day, while final timelines depend on underwriting complexity and supporting documents."
  },
  {
    question: "Can I qualify with lower credit?",
    answer:
      "Yes. Some lenders evaluate cash flow strength, receivables, or equipment value in addition to credit score, depending on the product."
  }
];

export function getProductFaqs(productName: string): FaqItem[] {
  return [
    {
      question: `How does ${productName} work?`,
      answer: `${productName} provides business capital that can be structured around your cash flow profile, repayment preferences, and growth timeline.`
    },
    ...baseFaqs
  ];
}

export function getLocationFaqs(productName: string, locationName: string): FaqItem[] {
  return [
    {
      question: `Do you offer ${productName} in ${locationName}?`,
      answer: `Yes. We support eligible businesses in ${locationName} with tailored ${productName.toLowerCase()} options based on industry and annual revenue.`
    },
    ...baseFaqs
  ];
}

export function getIndustryFaqs(productName: string, industryName: string): FaqItem[] {
  return [
    {
      question: `Is ${productName} available for ${industryName} businesses?`,
      answer: `Absolutely. ${industryName.charAt(0).toUpperCase()}${industryName.slice(
        1
      )} operators can access programs designed for contract cycles, seasonality, and working-capital needs.`
    },
    ...baseFaqs
  ];
}

export function getIntentFaqs(productName: string, intentLabel: string): FaqItem[] {
  return [
    {
      question: `Can I get ${productName.toLowerCase()} with ${intentLabel}?`,
      answer: `Yes. We match applicants with lenders that align to priorities like ${intentLabel}, while balancing rates, terms, and qualification criteria.`
    },
    ...baseFaqs
  ];
}
