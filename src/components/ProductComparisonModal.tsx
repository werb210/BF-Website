type ProductComparisonModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function ProductComparisonModal({ open, onClose }: ProductComparisonModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-4xl overflow-auto rounded bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Compare Financing Options</h2>

        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Product</th>
              <th className="border p-2">Speed</th>
              <th className="border p-2">Collateral</th>
              <th className="border p-2">Cost</th>
              <th className="border p-2">Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Term Loan</td>
              <td className="border p-2">Medium</td>
              <td className="border p-2">Usually Required</td>
              <td className="border p-2">Low to Medium</td>
              <td className="border p-2">Structured growth</td>
            </tr>
            <tr>
              <td className="border p-2">Line of Credit</td>
              <td className="border p-2">Fast</td>
              <td className="border p-2">Often Flexible</td>
              <td className="border p-2">Medium</td>
              <td className="border p-2">Working capital</td>
            </tr>
            <tr>
              <td className="border p-2">Factoring</td>
              <td className="border p-2">Very Fast</td>
              <td className="border p-2">Invoice-backed</td>
              <td className="border p-2">Medium to High</td>
              <td className="border p-2">Cash flow gaps</td>
            </tr>
          </tbody>
        </table>

        <button onClick={onClose} className="mt-4 underline">
          Close
        </button>
      </div>
    </div>
  );
}
