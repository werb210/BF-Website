import ProductTemplate from "@/templates/ProductTemplate";

export default function TermLoans() {
  return (
    <ProductTemplate
      title="Term Loans"
      description="Structured growth capital with fixed repayment terms for expansion, refinancing, or large strategic initiatives."
      bestFor={[
        "Expansion projects with defined budget and timeline",
        "Debt consolidation to simplify monthly cash management",
        "Longer-term capital needs that benefit from predictable payments",
      ]}
      howItWorks={[
        "Complete one intake with your core business and financial profile",
        "Boreal structures the file for lender fit and repayment alignment",
        "Compare offers and close the structure that best fits your objectives",
      ]}
    />
  );
}
