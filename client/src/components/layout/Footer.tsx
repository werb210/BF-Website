import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[#071a2f] text-gray-300 py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-8">
        <div>
          <h3 className="text-white font-semibold mb-4">Boreal Financial</h3>
          <p>Structured non-bank financing for Canadian businesses.</p>
        </div>

        <div>
          <h4 className="text-white mb-4">Explore</h4>
          <ul className="space-y-2">
            <li><Link href="/how-it-works">How It Works</Link></li>
            <li><Link href="/products">Products</Link></li>
            <li><Link href="/industries">Industries</Link></li>
            <li><Link href="/privacy" className="block hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="block hover:text-white">Terms of Use</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white mb-4">Contact</h4>
          <ul className="space-y-2">
            <li><a href="/apply">Apply Now</a></li>
            <li><a href="/credit-readiness">Check your Credit Readiness</a></li>
            <li><a href="https://staff.boreal.financial" target="_blank">Staff Login</a></li>
            <li><a href="https://staff.boreal.financial/lender-login" target="_blank">Lender Login</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
