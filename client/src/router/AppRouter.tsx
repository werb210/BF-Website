import { Routes, Route } from "react-router-dom"

import Home from "../pages/Home"
import Contact from "../pages/Contact"
import Compare from "../pages/Compare"
import CreditReadiness from "../pages/CreditReadiness"
import CreditResults from "../pages/CreditResults"
import Podcasts from "../pages/Podcasts"

import IndustryDetail from "../pages/industries/IndustryDetail"

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/industries/construction" element={<IndustryDetail slug="construction" />} />
      <Route path="/industries/manufacturing" element={<IndustryDetail slug="manufacturing" />} />
      <Route path="/industries/logistics" element={<IndustryDetail slug="logistics" />} />

      <Route path="/industries/:slug" element={<IndustryDetail />} />

      <Route path="/product-comparison" element={<Compare />} />
      <Route path="/compare" element={<Compare />} />

      <Route path="/credit-readiness" element={<CreditReadiness />} />
      <Route path="/credit-results" element={<CreditResults />} />

      <Route path="/podcasts" element={<Podcasts />} />

      <Route path="/contact" element={<Contact />} />
    </Routes>
  )
}

export default AppRouter
