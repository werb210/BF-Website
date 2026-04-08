import ProductTemplate from "@/templates/ProductTemplate";

export default function Equipment() {
  return (
    <ProductTemplate
      title="Equipment Financing"
      description="Finance revenue-producing equipment while preserving cash for operations and growth."
      bestFor={[
        "Fleet additions, replacements, or modernization",
        "Manufacturing machinery and production-line upgrades",
        "Asset-heavy businesses requiring specialized equipment",
      ]}
      howItWorks={[
        "Provide quote, vendor details, and intended use",
        "Lenders underwrite based on asset and operating profile",
        "Select terms aligned to budget and asset life",
      ]}
    />
  );
}
