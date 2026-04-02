import { APPLY_URL } from "@/config/links";

type Props = {
  title: string;
  headline: string;
  description: string;
  bullets: string[];
};

export default function IndustryAdvisoryTemplate({ title, headline, description, bullets }: Props) {
  return (
    <div className="bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-12">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{title} Advisory</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight md:text-5xl">{headline}</h1>
        <p className="mt-6 max-w-3xl text-lg text-slate-300">{description}</p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {bullets.map((bullet) => (
            <div key={bullet} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-slate-200">
              {bullet}
            </div>
          ))}
        </div>

        <a href={APPLY_URL} className="mt-10 inline-flex rounded-md bg-white px-6 py-3 font-semibold text-slate-900">
          Apply Now
        </a>
      </section>
    </div>
  );
}
