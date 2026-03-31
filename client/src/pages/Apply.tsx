import { useEffect } from "react";
import { APPLY_URL } from "@/config/site";

export default function Apply() {
  const applyHref = `${APPLY_URL}${window.location.search}`;

  useEffect(() => {
    window.location.href = applyHref;
  }, [applyHref]);

  return (
    <section className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-3xl font-bold">Redirecting to Application</h1>
      <p className="mt-3 text-slate-600">
        If you are not redirected, <a href={applyHref} className="underline">click here to continue</a>.
      </p>
    </section>
  );
}
