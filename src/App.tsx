import { lazy, Suspense } from "react";
import { AppRouter as Router } from "./router/AppRouter";
import LeadForm from "./features/lead/LeadForm";

const MayaWidget = lazy(() => import("./components/MayaWidget"));

function shouldRenderGlobalMaya(): boolean {
  const path = window.location.pathname.toLowerCase();
  return !path.startsWith("/contact") && !path.startsWith("/credit-results");
}

function App() {
  const showMaya = shouldRenderGlobalMaya();

  return (
    <>
      <Router />
      <LeadForm />
      <Suspense fallback={null}>
        {showMaya ? <MayaWidget /> : null}
      </Suspense>
    </>
  );
}

export default App;
