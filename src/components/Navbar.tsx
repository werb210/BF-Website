import { useState } from "react";
import { Link } from "react-router-dom";
import { APPLY_URL } from "@/config/links";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-subtle bg-brand-bg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-white hover:opacity-90"
          onClick={() => setOpen(false)}
        >
          Boreal Financial
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-white/80 md:flex">
          <Link href="/products" className="hover:text-white">
            Products
          </Link>
          <Link href="/industries" className="hover:text-white">
            Industries
          </Link>
          <Link href="/credit-readiness" className="hover:text-white">
            Credit Readiness
          </Link>
          <Link href="/contact" className="hover:text-white">
            Contact
          </Link>
          <a
            href={APPLY_URL}
            className="flex h-10 items-center rounded-full bg-brand-accent px-6 font-medium text-white transition-colors hover:bg-brand-accentHover"
          >
            Apply Now
          </a>
        </nav>

        <button
          className="text-white md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="space-y-4 border-t border-subtle bg-brand-bgAlt px-6 py-4 md:hidden">
          <Link href="/products" className="block text-white/80 hover:text-white" onClick={() => setOpen(false)}>
            Products
          </Link>
          <Link href="/industries" className="block text-white/80 hover:text-white" onClick={() => setOpen(false)}>
            Industries
          </Link>
          <Link href="/credit-readiness" className="block text-white/80 hover:text-white" onClick={() => setOpen(false)}>
            Credit Readiness
          </Link>
          <Link href="/contact" className="block text-white/80 hover:text-white" onClick={() => setOpen(false)}>
            Contact
          </Link>
          <a
            href={APPLY_URL}
            className="flex h-10 items-center justify-center rounded-full bg-brand-accent px-6 font-medium text-white transition-colors hover:bg-brand-accentHover"
            onClick={() => setOpen(false)}
          >
            Apply Now
          </a>
        </div>
      )}
    </header>
  );
}
