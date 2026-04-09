import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ApplyNowButton, AskQuestionButton } from "@/components/cta-buttons";

export function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { href: "/products", label: "Products" },
    { href: "/industries", label: "Industries" }
  ];

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3" data-testid="logo-boreal-financial">
            <div style={{ width: "100%", height: "200px", background: "linear-gradient(135deg, #0a0f1c, #1c2a4a)", borderRadius: "8px" }} />
            <span className="text-white text-lg font-semibold tracking-wide">
              Boreal Financial
            </span>
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                      location === item.href
                        ? "text-primary bg-primary/10"
                        : "text-secondary hover:text-primary"
                    }`}
                    data-testid={`nav-link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
              <AskQuestionButton size="sm" variant="outline">
                Contact Us
              </AskQuestionButton>
              <ApplyNowButton size="sm">Apply Now</ApplyNowButton>
            </div>
          </div>

          <div className="md:hidden">
            <button
              className="p-2 rounded-md hover:bg-muted"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-2">
            <div className="flex flex-col space-y-1">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      location === item.href
                        ? "text-primary bg-primary/10"
                        : "text-secondary hover:text-primary"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`mobile-nav-link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
              <div className="px-3 py-2 space-y-2">
                <AskQuestionButton className="w-full" size="sm" variant="outline">
                  Contact Us
                </AskQuestionButton>
                <ApplyNowButton className="w-full" size="sm">
                  Apply Now
                </ApplyNowButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
