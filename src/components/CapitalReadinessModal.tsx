type CapitalReadinessModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function CapitalReadinessModal({ open, onClose }: CapitalReadinessModalProps) {
  if (!open) return null;

  const score = Math.floor(Math.random() * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded bg-white p-6">
        <h2 className="text-xl font-bold">Credit Readiness Score</h2>
        <p className="mt-4">Your preliminary readiness score: {score}/100</p>

        <button onClick={onClose} className="mt-4 underline">
          Close
        </button>
      </div>
    </div>
  );
}
