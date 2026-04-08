import { useState, type FormEvent } from "react";

type Readiness = "Strong" | "Moderate" | "Needs Structuring";

export default function ReadinessModal() {
  const [score, setScore] = useState<Readiness | null>(null);

  function calculate(data: { years: number; revenue: number; profit: boolean; credit: number }) {
    let points = 0;
    if (data.years > 2) points += 2;
    if (data.revenue > 500000) points += 2;
    if (data.profit) points += 2;
    if (data.credit > 650) points += 2;

    if (points >= 7) return "Strong";
    if (points >= 4) return "Moderate";
    return "Needs Structuring";
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const result = calculate({
      years: Number(form.get("years")),
      revenue: Number(form.get("revenue")),
      profit: form.get("profit") === "yes",
      credit: Number(form.get("credit")),
    });
    setScore(result);
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Capital Readiness Score</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full rounded border p-2" name="years" placeholder="Years in business" required />
        <input className="w-full rounded border p-2" name="revenue" placeholder="Annual revenue" required />
        <select className="w-full rounded border p-2" name="profit" required>
          <option value="">Profitable?</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <input className="w-full rounded border p-2" name="credit" placeholder="Estimated credit score" required />
        <button type="submit" className="rounded bg-slate-900 px-4 py-2 font-medium text-white">Calculate</button>
      </form>

      {score && <div className="mt-4">Your Rating: <strong>{score}</strong></div>}
    </div>
  );
}
