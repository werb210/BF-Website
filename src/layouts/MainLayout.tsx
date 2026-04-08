import type { ReactNode } from "react";
import Header from "@/components/Header";
import { Footer } from "@/components/footer";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
