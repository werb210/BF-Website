import { useState } from "react";

export default function CapitalScore() {
  const [rev, setRev] = useState("");
  const [yrs, setYrs] = useState("");

  const score = rev && yrs ? Math.min(100, Math.round(Number(rev) / 10000 + Number(yrs) * 8)) : null;

  return (
    <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 text-center shadow-lg">
      <h3 className="mb-4 text-2xl font-bold">Capital Readiness Score</h3>

      <input
        type="number"
        placeholder="Annual Revenue"
        className="mb-3 w-full border p-2"
        value={rev}
        onChange={(e) => setRev(e.target.value)}
      />

      <input
        type="number"
        placeholder="Years in Biz"
        className="mb-3 w-full border p-2"
        value={yrs}
        onChange={(e) => setYrs(e.target.value)}
      />

      {score !== null && <div className="text-xl font-semibold">Score: {score}/100</div>}
    </div>
  );
}
