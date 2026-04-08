import { useState } from "react";

export default function LeadModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg"
      >
        Get Capital Strategy
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              Request Capital Strategy Call
            </h3>

            <input
              placeholder="Name"
              className="border p-3 w-full mb-3"
            />
            <input
              placeholder="Email"
              className="border p-3 w-full mb-3"
            />
            <input
              placeholder="Company"
              className="border p-3 w-full mb-4"
            />

            <button
              className="bg-orange-500 text-white w-full py-3 rounded-lg"
              onClick={() => setOpen(false)}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
}
