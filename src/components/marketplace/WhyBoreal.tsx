const points = ["80+ Active Lenders", "24-48 Hour Reviews", "Transparent Terms", "Dedicated Support"];

export function WhyBoreal() {
  return (
    <section className="bg-slate-50 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl font-semibold">Why Boreal</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          {points.map((point) => (
            <article key={point} className="rounded-lg border bg-white p-4">
              <h3 className="font-medium">{point}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
