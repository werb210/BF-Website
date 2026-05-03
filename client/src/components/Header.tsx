import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import logo from "/images/header_white_transparent.png";
import { APPLY_URL } from "@/config/site";

const navItems = [
  { href: "/products", label: "Products" },
  { href: "/industries", label: "Industries" },
  { href: "/credit-readiness", label: "Credit Readiness" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="site-header w-full border-b border-white/10 bg-[#0B1320]/95 backdrop-blur">
      <div className="container flex min-h-20 items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-3 sm:gap-4" onClick={() => setOpen(false)}>
          <img src={logo} alt="Boreal Financial" width={512} height={128} className="h-14 w-auto object-contain md:h-20" loading="lazy" decoding="async" />
          <span className="text-base font-semibold tracking-wide text-white sm:text-xl">Boreal Financial</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-white md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={location === item.href ? "text-white" : "text-white/80 hover:text-white"}>
              {item.label}
            </Link>
          ))}
          {/* BF_WEBSITE_BLOCK_v82_BI_LINK_REVERT_v1 — boreal.insure
              isn't registered yet (NXDOMAIN). Match the mobile drawer
              link (line ~78) that already uses the Azure Static Web
              App URL. Revisit once boreal.insure resolves. */}
          <a
            href="https://delightful-sand-05a55580f.7.azurestaticapps.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold ml-4"
          >
            Visit Boreal Insurance
          </a>
          <a
            href={APPLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-500"
          >
            Apply Now
          </a>
        </nav>

        <button type="button" className="rounded-md p-2 text-white md:hidden" onClick={() => setOpen((prev) => !prev)} aria-label="Toggle navigation menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true">
          <button type="button" aria-label="Close mobile navigation" className="absolute inset-0 bg-black/55" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[min(88vw,360px)] overflow-auto border-l border-white/10 bg-[#081325] p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-semibold text-white">Menu</span>
              <button type="button" className="rounded-md p-2 text-white" onClick={() => setOpen(false)} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className={location === item.href ? "text-white" : "text-white/80"} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <a
                href={APPLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex justify-center rounded-full bg-blue-600 px-5 py-3 font-medium text-white"
                onClick={() => setOpen(false)}
              >
                Apply Now
              </a>
              {/* BF_WEBSITE_BLOCK_1_13_V2 — cross-link to BI-Website */}
              <a
                href="https://delightful-sand-05a55580f.7.azurestaticapps.net/"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex justify-center rounded-full border border-white px-5 py-3 font-medium text-white"
                onClick={() => setOpen(false)}
              >
                Visit Boreal Insurance
              </a>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
