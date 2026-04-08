export default function ComparisonModal() {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Bank vs Boreal Comparison</h2>
      <table className="w-full border text-left text-sm">
        <thead>
          <tr className="bg-slate-100">
            <th className="border p-3">Feature</th>
            <th className="border p-3">Banks</th>
            <th className="border p-3">Boreal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-3">Approval Speed</td>
            <td className="border p-3">2–8 weeks</td>
            <td className="border p-3">24–72 hours</td>
          </tr>
          <tr>
            <td className="border p-3">Flexibility</td>
            <td className="border p-3">Low</td>
            <td className="border p-3">High</td>
          </tr>
          <tr>
            <td className="border p-3">Lender Access</td>
            <td className="border p-3">Single</td>
            <td className="border p-3">Multi-lender marketplace</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
