import ProductTemplate from "@/templates/ProductTemplate";

export default function LineOfCredit() {
  return (
    <ProductTemplate
      title="Line of Credit"
      description="Flexible revolving access to capital for ongoing working-capital and operating-cycle coverage."
      bestFor={[
        "Seasonal revenue swings and short-term liquidity gaps",
        "Payroll, vendor, and rent coverage during receivable delays",
        "Businesses that need reusable capital without repeated applications",
      ]}
      howItWorks={[
        "Submit business banking and operating history once",
        "Lenders evaluate revolving-limit fit and pricing",
        "Draw and repay as needed to restore availability",
      ]}
    />
  );
}
