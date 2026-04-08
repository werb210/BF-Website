import ProductTemplate from "@/templates/ProductTemplate";

export default function Factoring() {
  return (
    <ProductTemplate
      title="Factoring"
      description="Accelerate receivables into immediate working capital without waiting for standard customer payment terms."
      bestFor={[
        "B2B operators carrying 30-90 day invoice cycles",
        "Growing companies where receivables are outpacing liquidity",
        "Businesses that need stable cash to fund payroll and suppliers",
      ]}
      howItWorks={[
        "Share AR aging, sample invoices, and customer mix",
        "Lenders review debtor quality and invoice integrity",
        "Receive advances against approved invoices to smooth cash flow",
      ]}
    />
  );
}
