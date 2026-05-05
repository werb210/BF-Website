// BF_WEBSITE_BLOCK_v130c_READINESS_HANDOFF_REPAIR_v1
//
// This file used to be a 146-line stub form whose handleSubmit was:
//     function handleSubmit(event) {
//       event.preventDefault();
//       navigate("/credit-results");
//     }
// — i.e. it never POSTed anywhere. Anyone hitting /capital-readiness (which
// renders pages/CapitalReadiness.tsx, which imports this component) got a
// form that did nothing on submit. The CreditResults page reads from
// sessionStorage that nobody writes, so it always rendered "No results yet".
//
// Collapsed to a re-export of the working 14-field page. pages/CapitalReadiness.tsx
// keeps its existing import path; the form it embeds is now the same one /credit-readiness
// uses, which actually POSTs to /api/website/credit-readiness, computes the
// score, writes sessionStorage, and navigates to /credit-results.
//
// AppRouter.tsx already routes /credit-readiness to pages/CreditReadiness directly,
// so the only consumer of this re-export is pages/CapitalReadiness.tsx.

export { default } from "../pages/CreditReadiness";
