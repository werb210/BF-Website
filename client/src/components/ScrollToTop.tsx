// BF_WEBSITE_BLOCK_v153_MOBILE_FIRST_LAUNCH_v1
// Scrolls window to top on every wouter route change. Mounted once in
// MainLayout. Pre-fix: scrollToTop() existed (in src/utils/scrollToTop.ts)
// but was only called by VerticalPage.tsx, so navigating to /products or
// /industries from a footer link landed at the previous page's scroll
// position, which made the new page look like it was rendering from
// mid-content. Particularly visible after submitting /credit-readiness
// — the result page loaded at the footer instead of at the readiness
// score (screenshot 11.25.30).
import { useEffect } from "react";
import { useLocation } from "wouter";
import { scrollToTop } from "@/utils/scrollToTop";

export default function ScrollToTop(): null {
  const [pathname] = useLocation();
  useEffect(() => {
    scrollToTop();
  }, [pathname]);
  return null;
}
