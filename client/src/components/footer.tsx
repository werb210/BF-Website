import { Link } from "wouter";
import { APPLY_URL } from "@/config/site";
import logoUrl from "@/assets/logo-boreal-mountains-white.svg";

export function Footer() {
  return (
    <footer className="bg-[#0a1120] border-t border-[#1c2538] text-white/80 px-6 py-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid gap-8 mb-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img src={logoUrl} alt="" className="h-8 w-auto" />
              <span className="font-semibold text-white">Boreal Financial</span>
            </div>
            <p className="text-sm leading-relaxed text-white/65">
              Structured lending marketplace helping businesses across Canada and the United States.
            </p>
          </div>
          <div>
            <div className="font-semibold text-white mb-3">Explore</div>
            <ul className="list-none p-0 m-0 text-sm leading-loose">
              <li><Link href="/how-it-works" className="text-white/75 no-underline">How It Works</Link></li>
              {/* BF_WEBSITE_BLOCK_v83_LAUNCH_POLISH_v1 — was /products/term-loans; fixed to /products index */}
              <li><Link href="/products" className="text-white/75 no-underline">Products</Link></li>
              {/* BF_WEBSITE_BLOCK_v83_LAUNCH_POLISH_v1 — was /industries/construction; fixed to /industries index */}
              <li><Link href="/industries" className="text-white/75 no-underline">Industries</Link></li>
              {/* BF_WEBSITE_BLOCK_v83_LAUNCH_POLISH_v1 — Visit Boreal Risk Management fixed to live domain */}
              <li><a href="https://www.boreal.insure/" target="_blank" rel="noopener noreferrer" className="text-white/75 no-underline">Boreal Risk Management</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-white mb-3">Apply Now</div>
            <a href={APPLY_URL} target="_blank" rel="noopener noreferrer"
               className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium no-underline mb-3">
              Apply Now
            </a>
            {/* BF_WEBSITE_BLOCK_v83_LAUNCH_POLISH_v1 — single credit readiness target */}
            <Link href="/credit-readiness" className="block text-white/75 no-underline text-sm mb-2">
              Check your Credit Readiness
            </Link>
            <Link href="/contact" className="block text-white/75 no-underline text-sm mb-2">Contact Us</Link>
            <Link href="/product-comparison" className="block text-white/75 no-underline text-sm">Product Comparison</Link>
          </div>
        </div>
        <div className="border-t border-[#1c2538] pt-4 flex justify-between text-xs text-white/55">
          <div className="flex gap-4">
            <Link href="/privacy" className="text-inherit no-underline">Privacy Policy</Link>
            <Link href="/terms" className="text-inherit no-underline">Terms of Service</Link>
          </div>
          <div>© {new Date().getFullYear()} Boreal Financial</div>
        </div>
      </div>
    </footer>
  );
}


export default Footer;
