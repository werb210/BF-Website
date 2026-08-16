import { Switch, Route, Redirect } from "wouter";

import Home from "../pages/Home";
import UnitedStates from "../pages/UnitedStates";
import Contact from "../pages/Contact";
import Compare from "../pages/Compare";
import CreditReadiness from "../pages/CreditReadiness";
import CreditResults from "../pages/CreditResults";
import Apply from "../pages/Apply";
import EmailLanding from "../pages/EmailLanding";
import ReferralLanding from "../pages/ReferralLanding";
import FAQ from "../pages/FAQ";
import HowItWorks from "../pages/HowItWorks";
import Privacy from "../pages/privacy";
import NotFound from "../pages/NotFound";
import StaffLogin from "../pages/StaffLogin";
import PartnerLogin from "../pages/PartnerLogin";
import SystemStatus from "../pages/SystemStatus";
import MainLayout from "@/layouts/MainLayout";
import TermsPage from "../pages/TermsPage";
import SmsInfo from "../pages/SmsInfo";

import Industries from "../pages/Industries";
import IndustryDetail from "../pages/IndustryDetail";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";

export function AppRouter() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Home} />
        {/* BF_WEBSITE_US_v19 - landing page for the US ad campaign. */}
        <Route path="/us" component={UnitedStates} />
        <Route path="/usa" component={UnitedStates} />
        <Route path="/e/:slug">{(params) => <EmailLanding slug={(params as { slug?: string }).slug} />}</Route>
        {/* BF_WEBSITE_REFERRAL_LANDING_v1 */}
        <Route path="/r/f/:code">{(params) => <ReferralLanding code={(params as { code?: string }).code} variant="funding" />}</Route>
        <Route path="/r/b/:code">{(params) => <ReferralLanding code={(params as { code?: string }).code} variant="both" />}</Route>
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
        {/* BF_WEBSITE_ONE_READINESS_v1 - the orphan capital-readiness flow
            (parallel scoring system from an old site rebuild, never linked
            anywhere) is gone; anything hitting the old URL lands on the one
            real readiness check. */}
        <Route path="/capital-readiness">
          {() => <Redirect to="/credit-readiness" />}
        </Route>
        <Route path="/capital-readiness-score">
          {() => <Redirect to="/credit-readiness" />}
        </Route>
        <Route path="/compare" component={Compare} />
        <Route path="/product-comparison" component={Compare} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/faq" component={FAQ} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/sms" component={SmsInfo} />
        <Route path="/staff-login" component={StaffLogin} />
        <Route path="/lender-login" component={PartnerLogin} />
        <Route path="/system-status" component={SystemStatus} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

export default AppRouter;
