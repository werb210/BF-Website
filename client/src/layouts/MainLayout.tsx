import type { ReactNode } from "react";
import Header from "@/components/Header";
import { Footer } from "@/components/footer";
// BF_WEBSITE_BLOCK_v153_MOBILE_FIRST_LAUNCH_v1
import ScrollToTop from "@/components/ScrollToTop";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <ScrollToTop />
      <Header />
      {children}
      <Footer />
    </>
  );
}
