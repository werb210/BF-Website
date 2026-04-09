import { Link } from "react-router-dom";
import { APPLY_URL } from "@/config/links";

export function Navbar() {
  return (
    <header className="w-full border-b border-white/5 bg-[#020C1C]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center">
          <div className="flex items-center gap-3">
            <div style={{ width: "100%", height: "200px", background: "linear-gradient(135deg, #0a0f1c, #1c2a4a)", borderRadius: "8px" }} />
            <span className="text-white text-xl font-semibold tracking-wide">
              Boreal Financial
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-white/80 md:flex">
          <Link href="/products">Products</Link>
          <Link href="/industries">Industries</Link>
          <Link href="/credit-readiness">Credit Readiness</Link>
          <Link href="/contact">Contact</Link>

          <a
            href={APPLY_URL}
            className="ml-4 rounded-full bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Apply Now
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
