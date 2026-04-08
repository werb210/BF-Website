import { trackEvent } from "@/utils/analytics";

type CompareModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function CompareModal({ open, onClose }: CompareModalProps) {
  const close = () => {
    trackEvent("compare_table_view", {});
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Boreal vs Banks</h2>
        <table className="w-full border text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Feature</th>
              <th className="p-2">Bank</th>
              <th className="p-2">Boreal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">Speed</td>
              <td className="p-2">4–8 weeks</td>
              <td className="p-2">48–72 hrs</td>
            </tr>
            <tr>
              <td className="p-2">Collateral</td>
              <td className="p-2">Rigid</td>
              <td className="p-2">Flexible</td>
            </tr>
            <tr>
              <td className="p-2">Multi-Lender Marketplace</td>
              <td className="p-2">No</td>
              <td className="p-2">Yes</td>
            </tr>
          </tbody>
        </table>

        <button className="mt-4 rounded bg-gray-700 px-4 py-2 text-white" onClick={close}>
          Close
        </button>
      </div>
    </div>
  );
}
