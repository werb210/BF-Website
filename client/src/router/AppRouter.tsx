import { Switch, Route } from "wouter";

import Home from "../pages/Home";
import Contact from "../pages/Contact";
import Compare from "../pages/Compare";
import CreditReadiness from "../pages/CreditReadiness";
import CreditResults from "../pages/CreditResults";
import Podcasts from "../pages/Podcasts";
import Apply from "../pages/Apply";
import FAQ from "../pages/FAQ";
import HowItWorks from "../pages/HowItWorks";
import Privacy from "../pages/privacy";
import Terms from "../pages/terms";
import NotFound from "../pages/NotFound";
import CapitalReadiness from "../pages/CapitalReadiness";
import CapitalReadinessScore from "../pages/CapitalReadinessScore";
import StaffLogin from "../pages/StaffLogin";
import PartnerLogin from "../pages/PartnerLogin";
import SystemStatus from "../pages/SystemStatus";
import MainLayout from "@/layouts/MainLayout";

import Industries from "../pages/Industries";
import IndustryDetail from "../pages/IndustryDetail";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";

export function AppRouter() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/industries" component={Industries} />
        <Route path="/industries/:slug">
          {(params) => <IndustryDetail slug={params.slug} />}
        </Route>
        <Route path="/products" component={Products} />
        <Route path="/products/:slug">
          {(params) => <ProductDetail slug={params.slug} />}
        </Route>
        <Route path="/apply" component={Apply} />
        <Route path="/contact" component={Contact} />
        <Route path="/credit-readiness" component={CreditReadiness} />
        <Route path="/credit-results" component={CreditResults} />
        <Route path="/capital-readiness" component={CapitalReadiness} />
        <Route path="/capital-readiness-score" component={CapitalReadinessScore} />
        <Route path="/compare" component={Compare} />
        <Route path="/product-comparison" component={Compare} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/faq" component={FAQ} />
        <Route path="/podcasts" component={Podcasts} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/staff-login" component={StaffLogin} />
        <Route path="/lender-login" component={PartnerLogin} />
        <Route path="/system-status" component={SystemStatus} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

export default AppRouter;
