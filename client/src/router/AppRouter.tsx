import { Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "wouter";

import Home from "../pages/Home";
import MainLayout from "@/layouts/MainLayout";

const Contact = lazy(() => import("../pages/Contact"));
const Compare = lazy(() => import("../pages/Compare"));
const CreditReadiness = lazy(() => import("../pages/CreditReadiness"));
const CreditResults = lazy(() => import("../pages/CreditResults"));
const Apply = lazy(() => import("../pages/Apply"));
const EmailLanding = lazy(() => import("../pages/EmailLanding"));
const ReferralLanding = lazy(() => import("../pages/ReferralLanding"));
const FAQ = lazy(() => import("../pages/FAQ"));
const HowItWorks = lazy(() => import("../pages/HowItWorks"));
const Privacy = lazy(() => import("../pages/privacy"));
const NotFound = lazy(() => import("../pages/NotFound"));
const StaffLogin = lazy(() => import("../pages/StaffLogin"));
const PartnerLogin = lazy(() => import("../pages/PartnerLogin"));
const SystemStatus = lazy(() => import("../pages/SystemStatus"));
const TermsPage = lazy(() => import("../pages/TermsPage"));
const SmsInfo = lazy(() => import("../pages/SmsInfo"));
const Industries = lazy(() => import("../pages/Industries"));
const IndustryDetail = lazy(() => import("../pages/IndustryDetail"));
const Products = lazy(() => import("../pages/Products"));
const ProductDetail = lazy(() => import("../pages/ProductDetail"));

export function AppRouter() {
  return (
    <MainLayout>
      <Suspense fallback={null}>
        <Switch>
        <Route path="/" component={Home} />
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
      </Suspense>
    </MainLayout>
  );
}

export default AppRouter;
