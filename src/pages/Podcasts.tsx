const episodes = [
  {
    title: "Construction Cash Flow Playbook",
    excerpt: "How high-growth contractors avoid payroll gaps during draw delays and keep projects moving.",
    duration: "18 min",
    image: "",
  },
  {
    title: "Manufacturing Margin & Working Capital",
    excerpt: "A lender-facing view on balancing raw material spend, receivables timing, and capacity expansion.",
    duration: "22 min",
    image: "",
  },
  {
    title: "Logistics Growth Without Cash Compression",
    excerpt: "Learn how operators structure fleet growth and route funding while fuel and payables fluctuate.",
    duration: "16 min",
    image: "",
  },
];

export default function Podcasts() {
  return (
    <div className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-12">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Lender Broadcast</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">Insights from real funding conversations</h1>
          <p className="mt-5 text-lg text-slate-600">
            Watch concise episodes focused on credit readiness, lender expectations, and industry-specific financing strategies.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {episodes.map((episode) => (
            <article
              key={episode.title}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative">
                <div style={{ width: "100%", height: "200px", background: "linear-gradient(135deg, #0a0f1c, #1c2a4a)", borderRadius: "8px" }} />
                <span className="absolute left-4 top-4 rounded-full bg-slate-900/85 px-3 py-1 text-xs font-semibold text-white">{episode.duration}</span>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-slate-900">{episode.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{episode.excerpt}</p>
                <button className="mt-5 inline-flex rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                  Watch Episode
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
