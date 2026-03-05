import { Suspense, lazy, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/layout/Footer";
import { initGA, trackPageView } from "@/analytics/ga";
import { scrollToTop } from "@/utils/scrollToTop";

const Home = lazy(() => import("@/pages/Home"));
const HowItWorks = lazy(() => import("@/pages/HowItWorks"));
const Industries = lazy(() => import("@/pages/Industries"));
const IndustryDetail = lazy(() => import("@/pages/IndustryDetail"));
const Contact = lazy(() => import("@/pages/Contact"));
const PartnerLogin = lazy(() => import("@/pages/PartnerLogin"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Compare = lazy(() => import("@/pages/Compare"));
const CreditReadiness = lazy(() => import("@/pages/CreditReadiness"));
const CreditResults = lazy(() => import("@/pages/CreditResults"));
const Podcasts = lazy(() => import("@/pages/Podcasts"));
const Products = lazy(() => import("@/pages/Products"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const MediaFinancing = lazy(() => import("@/pages/products/MediaFinancing"));
const Apply = lazy(() => import("@/pages/Apply"));
const SystemStatus = lazy(() => import("@/pages/SystemStatus"));
const FAQ = lazy(() => import("@/pages/FAQ"));

function AnalyticsListener() {
  const [location] = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    trackPageView(location);
    scrollToTop();
  }, [location]);

  return null;
}


function PrefetchRoutes() {
  useEffect(() => {
    const prefetchLink = document.createElement("link");
    prefetchLink.rel = "prefetch";
    prefetchLink.href = "/apply";
    document.head.appendChild(prefetchLink);

    return () => {
      document.head.removeChild(prefetchLink);
    };
  }, []);

  return null;
}

export function AppRouter() {
  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <AnalyticsListener />
      <PrefetchRoutes />
      <Header />
      <main id="main-content">
        <Suspense fallback={<div className="px-4 py-8">Loading...</div>}>
          <Switch>
          <Route path="/" component={Home} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/about" component={HowItWorks} />

          <Route path="/products" component={Products} />
          <Route path="/business-loans" component={Products} />
          <Route path="/products/media-financing" component={MediaFinancing} />
          <Route path="/equipment-financing">{() => <ProductDetail slug="equipment-financing" />}</Route>
          <Route path="/products/:slug">{(params) => <ProductDetail slug={params.slug} />}</Route>

          <Route path="/industries" component={Industries} />
          <Route path="/industries/:slug">{(params) => <IndustryDetail slug={params.slug} />}</Route>

          <Route path="/product-comparison" component={Compare} />
          <Route path="/compare" component={Compare} />
          <Route path="/credit-readiness" component={CreditReadiness} />
          <Route path="/credit-results" component={CreditResults} />
          <Route path="/podcasts" component={Podcasts} />
          <Route path="/contact" component={Contact} />
          <Route path="/apply" component={Apply} />
          <Route path="/apply/:rest*" component={Apply} />
          <Route path="/lender-login" component={PartnerLogin} />
          <Route path="/system-status" component={SystemStatus} />
          <Route path="/faq" component={FAQ} />
          <Route path="*" component={NotFound} />
          </Switch>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}