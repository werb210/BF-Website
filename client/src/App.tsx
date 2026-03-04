import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { AppRouter } from "@/router/AppRouter";
import { trackEvent } from "@/utils/analytics";
import SeoJsonLd from "./components/SeoJsonLd";
import MayaWidget from "./components/MayaWidget";
import { financialServiceSchema, organizationSchema } from "./seo/structuredData";

function useRouteTracking() {
  const [location] = useLocation();

  useEffect(() => {
    trackEvent("page_view", {
      page_path: location,
    });
  }, [location]);
}

function App() {
  const trackedDepthRef = useRef({ fifty: false, seventyFive: false });

  useRouteTracking();

  useEffect(() => {
    function handleScroll() {
      const scrollPercent =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

      if (scrollPercent > 50 && !trackedDepthRef.current.fifty) {
        trackEvent("scroll_50");
        trackedDepthRef.current.fifty = true;
      }
      if (scrollPercent > 75 && !trackedDepthRef.current.seventyFive) {
        trackEvent("scroll_75");
        trackedDepthRef.current.seventyFive = true;
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <TooltipProvider delayDuration={200}>
      <SeoJsonLd data={organizationSchema} />
      <SeoJsonLd data={financialServiceSchema} />
      <Toaster />
      <div className="main-layout">
        <AppRouter />
      </div>
      <MayaWidget />
    </TooltipProvider>
  );
}

export default App;
