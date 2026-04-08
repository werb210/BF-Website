export default function ProductComparison() {
  const products = [
    {
      name: "Term Loan",
      bestFor: "Expansion & long-term projects",
      speed: "3–10 days",
      collateral: "Often required",
    },
    {
      name: "Line of Credit",
      bestFor: "Working capital flexibility",
      speed: "2–7 days",
      collateral: "Secured or unsecured",
    },
    {
      name: "Equipment Financing",
      bestFor: "Equipment upgrades",
      speed: "3–8 days",
      collateral: "Equipment itself",
    },
    {
      name: "Purchase Order Financing",
      bestFor: "Fulfilling large purchase orders",
      speed: "2–5 days",
      collateral: "Confirmed PO",
    },
    {
      name: "Factoring",
      bestFor: "Unlocking invoice cash",
      speed: "1–4 days",
      collateral: "Invoices",
    },
    {
      name: "Merchant Cash Advance",
      bestFor: "Fast revenue-based capital",
      speed: "1–3 days",
      collateral: "Sales volume",
    },
    {
      name: "Asset Based Lending",
      bestFor: "Leveraging balance sheet assets",
      speed: "5–15 days",
      collateral: "Assets (A/R, Inventory, Equipment, or Real Estate)",
    },
    {
      name: "Media Financing",
      bestFor: "Funding media receivables",
      speed: "7–21 days",
      collateral: "Media contracts",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b1220] px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-12 text-4xl font-semibold">Product Comparison</h1>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/20">
                <th className="py-4 px-4 border-r border-white/10">Product</th>
                <th className="py-4 px-4 border-r border-white/10">Best For</th>
                <th className="py-4 px-4 border-r border-white/10">Speed</th>
                <th className="py-4 px-4">Collateral</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.name} className="border-b border-white/5">
                  <td className="p-4 border-r border-white/10 font-medium">{product.name}</td>
                  <td className="p-4 border-r border-white/10 text-white/80">{product.bestFor}</td>
                  <td className="p-4 border-r border-white/10 text-white/80">{product.speed}</td>
                  <td className="p-4 text-white/80">{product.collateral}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
