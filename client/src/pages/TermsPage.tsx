import Header from "@/components/Header";
import Footer from "@/components/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a1120] text-white">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-sm text-white/60 mb-8">Last updated: {new Date().toISOString().slice(0,10)}</p>
        <section className="space-y-6 text-sm leading-relaxed text-white/80">
          <p>Welcome to Boreal Financial. By accessing or using this website and our application services, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.</p>
          <h2 className="text-xl font-semibold text-white mt-8">1. Service description</h2>
          <p>Boreal Financial operates a lending marketplace that introduces business borrowers to a network of independent lenders. We do not ourselves underwrite, fund, or originate loans. All credit decisions are made by the lender to whom your application is submitted.</p>
          <h2 className="text-xl font-semibold text-white mt-8">2. Eligibility</h2>
          <p>You must be at least 18 years of age and authorized to submit a credit application on behalf of the business you represent.</p>
          <h2 className="text-xl font-semibold text-white mt-8">3. Information accuracy</h2>
          <p>You agree that all information you submit is accurate, current, and complete to the best of your knowledge. You authorize Boreal Financial and its lender network to verify any information submitted, including through credit bureau lookups where applicable and consented to.</p>
          <h2 className="text-xl font-semibold text-white mt-8">4. Privacy</h2>
          <p>Use of the service is also governed by our <a href="/privacy" className="text-blue-400">Privacy Policy</a>.</p>
          <h2 className="text-xl font-semibold text-white mt-8">5. Contact</h2>
          <p>Questions about these terms: <a href="mailto:info@boreal.financial" className="text-blue-400">info@boreal.financial</a>.</p>
          <p className="text-white/50 text-xs mt-8">[Placeholder — replace this Terms body with the full text supplied by counsel before public launch.]</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
